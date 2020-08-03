import flask

from api.data.dataloaders.reviews_loader import insert_review

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

    try:
        content = request_json['content']
        workload = request_json['workload']
        evaluation = request_json['evaluation']
        course_professor_id = request_json['course']
    except KeyError:
        return {'error': 'Missing inputs'}

    try:
        review_id = insert_review(
            course_professor_id,
            content,
            workload,
            evaluation
        )
    except Exception:
        return {'error': 'Invalid review'}

    return {'reviewId': review_id}
