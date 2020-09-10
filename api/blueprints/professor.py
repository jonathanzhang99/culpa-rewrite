import flask

from api.data.dataloaders.professors_loader import load_professor_courses, \
     load_professor_basic_info_by_id
from api.data.dataloaders.reviews_loader import \
    prepare_professor_query_prefix, load_review_highlight
from api.blueprints.review import parse_review

professor_blueprint = flask.Blueprint('professor_blueprint', __name__)


@professor_blueprint.route('/<int:professor_id>', methods=['GET'])
def professor_info(professor_id):
    # TODO: Fetch professor nugget status
    name = load_professor_basic_info_by_id(professor_id)
    if not name:
        return {'error': 'Missing professor name'}, 400

    courses = load_professor_courses(professor_id)
    courses_json = [{
        'courseId': course['course_id'],
        'courseName': course['name'],
        'courseCallNumber': course['call_number']
    } for course in courses]

    professor_summary_json = {
        'firstName': name[0]['first_name'],
        'lastName': name[0]['last_name'],
        'courses': courses_json
    }

    ip = flask.request.remote_addr
    professor_query_prefix = prepare_professor_query_prefix(professor_id)

    professor_review_highlight = load_review_highlight(
        professor_query_prefix, ip)
    professor_review_highlight_json = [
        parse_review(review, 'professor')
        for review in professor_review_highlight
    ]

    return {
        'professorSummary': professor_summary_json,
        'professorReviewHighlight': professor_review_highlight_json
    }


@professor_blueprint.route('/<professor_id>/courses', methods=['GET'])
def professor_courses(professor_id):
    '''
    This route is used when choosing among a professor's courses to review in
    the 'Write A Review' flow rather than to display on the professor info page
    '''
    courses = load_professor_courses(professor_id)

    # TODO: (Sungbin, JZ) change json to conform to frontend props spec
    courses_json = [{
        'text': course['name'],
        'value': course['course_id'],
        'key': course['name']
    } for course in courses]

    return {'courses': courses_json}
