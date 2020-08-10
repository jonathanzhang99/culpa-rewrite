import flask

from api.data.dataloaders.courses_loader import get_cp_id_by_course
from api.data.dataloaders.professors_loader import get_cp_id_by_prof
from api.data.dataloaders.reviews_loader import get_reviews_by_cp_id
from api.data.datawriters.reviews_writer import insert_review

review_blueprint = flask.Blueprint('review_blueprint', __name__)


@review_blueprint.route('/submit', methods=['POST'])
def submit_review():
    '''
    Inserts a review into the database. Even though the frontend
    passes a professor_id selected by the user, the course_professor_id
    contains all of the information needed to create a review and
    we ignore the professor_id.
    '''
    if not flask.request.is_json:
        return {'error': 'Missing JSON in request'}, 422

    request_json = flask.request.get_json()

    ip_addr = flask.request.remote_addr
    try:
        content = request_json['content']
        workload = request_json['workload']
        evaluation = request_json['evaluation']

        # the frontend name is `course` to keep consistency.
        course_professor_id = request_json['course']
    except KeyError:
        return {'error': 'Missing inputs'}, 400

    try:
        review_id = insert_review(
            course_professor_id,
            content,
            workload,
            evaluation,
            ip_addr
        )
    except Exception:
        return {'error': 'Invalid review'}, 400

    return {'reviewId': review_id}


@review_blueprint.route('/get', methods=['GET', 'POST'])
def get_reviews():
    sorting_spec = {
        'best': ['rating', True],
        'worst': ['rating', False],
        'newest': ['submission_date', True],
        'oldest': ['submission_date', False],
        'most agreed': ['upvotes', True],
        'most disagreed': ['downvotes', True]
    }

    ip = flask.request.remote_addr
    url_args = flask.request.args
    body_params = flask.request.get_json()

    # getting basic information: page type and id
    if url_args.get('type') == 'professor':
        cp_ids = get_cp_id_by_prof(url_args.get('professorId'))
    elif url_args.get('type') == 'course':
        cp_ids = get_cp_id_by_course(url_args.get('courseId'))
    else:
        return {
            "error": "invalid page type"
        }, 400

    # getting sorting and filtering settings
    sorting = None
    if body_params:
        if 'sorting' in body_params:
            sorting = body_params.get('sorting').lower()
            if sorting not in sorting_spec:
                return {
                    "error": "invalid sorting setting"
                }, 400

    try:
        if sorting:
            sort_crit, sort_desc = sorting_spec[sorting]
        cp_id_list = [x['course_professor_id'] for x in cp_ids]
        reviews = get_reviews_by_cp_id(
            cp_id_list, ip, sort_crit, sort_desc
        ) if sorting else get_reviews_by_cp_id(cp_id_list, ip)

        json = [{
            'id': review['review_id'],
            'content': review['content'],
            'workload': review['workload'],
            'rating': review['rating'],
            'submissionDate': review['submission_date'],
            'upvotes': int(review['upvotes']),
            'downvotes': int(review['downvotes']),
            'funnys': int(review['funnys']),
            'upvoteClicked': bool(review['upvote_clicked']),
            'downvoteClicked': bool(review['downvote_clicked']),
            'funnyClicked': bool(review['funny_clicked'])
        } for review in reviews]
        return {'reviews': json}

    except Exception as e:
        # print statement for debugging
        print(e)
        return {"error": str(e)}, 500
