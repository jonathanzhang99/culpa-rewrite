import flask
from datetime import datetime, timedelta

from api.data.dataloaders.reviews_loader import get_reviews_with_query_prefix,\
    prepare_course_query_prefix, prepare_professor_query_prefix
from api.data.datawriters.reviews_writer import insert_review

review_blueprint = flask.Blueprint('review_blueprint', __name__)


def parse_review(review, review_type):
    '''
    static method for parsing a review into a json object
    '''
    formatted_date = review['submission_date'].strftime("%b %d, %Y")
    deprecated = (
        datetime.utcnow() - review['submission_date']
    ) / timedelta(days=1) >= flask.current_app.config.get(
        'REVIEW_DEPRECATED_THRESHOLD_DAYS'
    )

    if review_type == 'course':
        reviewHeader = {
            'profId': review['professor_id'],
            'profFirstName': review['first_name'],
            'profLastName': review['last_name'],
            'uni': review['uni']
        }
    else:
        reviewHeader = {
            'courseId': review['course_id'],
            'courseName': review['name'],
            'courseCode': review['call_number']
        }

    return {
            'reviewType': review_type,
            'reviewHeader': reviewHeader,
            'votes': {
                'initUpvoteCount': int(review['agrees']),
                'initDownvoteCount': int(review['disagrees']),
                'initFunnyCount': int(review['funnys']),
                'upvoteClicked': bool(review['agree_clicked']),
                'downvoteClicked': bool(review['disagree_clicked']),
                'funnyClicked': bool(review['funny_clicked']),
            },
            'reviewId': review['review_id'],
            'content': review['content'],
            'workload': review['workload'],
            'submissionDate': formatted_date,
            'deprecated': deprecated,
        }


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

    review_id = insert_review(
        course_professor_id,
        content,
        workload,
        evaluation,
        ip_addr
    )

    return {'reviewId': review_id}


@review_blueprint.route('/get/<page_type>/<int:id>', methods=['GET'])
def get_reviews(page_type, id):
    '''
    loads reviews for a specific prof/course,
    supports sorting/filtering,
    used by both the Course/ProfessorPage (GET req through
    useDataFetch upon initial rendering) and the
    shared ReviewSection component (POST req when sorting
    and/or filtering criteria is changed)
    '''

    # key: sorting parameter strings from frontend
    # value: sorting parameters for the database
    # (corresponds to the sort_criterion and sort_order)
    db_sort_specs = {
        'most_positive': ['rating', 'DESC'],
        'most_negative': ['rating', 'ASC'],
        'newest': ['submission_date', 'DESC'],
        'oldest': ['submission_date', 'ASC'],
        'most_agreed': ['agrees', 'DESC'],
        'most_disagreed': ['disagrees', 'DESC']
    }
    page_type_and_query_prefixes = {
        'professor': prepare_professor_query_prefix,
        'course': prepare_course_query_prefix
    }

    ip = flask.request.remote_addr
    url_args = flask.request.args
    # getting basic information: page type
    if page_type not in page_type_and_query_prefixes:
        return {
            "error": "invalid page type"
        }, 400
    query_prefix = page_type_and_query_prefixes[page_type]

    # getting sorting and filtering settings
    filter_list, filter_year = None, None
    DEFAULT_SORT = flask.current_app.config.get('DEFAULT_SORT', 'newest')

    sorting = url_args.get('sorting', DEFAULT_SORT).lower()
    filter_list_raw = url_args.get('filterList', '')
    filter_year_raw = url_args.get('filterYear', '')

    sort_criterion, sort_order = db_sort_specs.get(
        sorting,
        db_sort_specs[DEFAULT_SORT]
    )

    if filter_list_raw:
        filter_list = [int(x) for x in filter_list_raw.split(',')]
    if filter_year_raw and filter_year_raw not in ['null', 'None']:
        filter_year = int(filter_year_raw)

    reviews = get_reviews_with_query_prefix(
        query_prefix(id, filter_list),
        ip, sort_criterion,
        sort_order,
        filter_year,
    )

    json = [parse_review(
        review,
        page_type,
    ) for review in reviews]

    return {'reviews': json}
