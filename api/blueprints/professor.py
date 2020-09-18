import flask

from api.data.dataloaders.professors_loader import load_professor_courses, \
     load_professor_basic_info_by_id
from api.data.dataloaders.reviews_loader import \
     prepare_professor_query_prefix, load_review_highlight
from api.blueprints.review import parse_review

professor_blueprint = flask.Blueprint('professor_blueprint', __name__)


def parse_professor(professor):
    '''
    static method for parsing professor into an json object
    '''
    professor_json = {
        'badges': [],
        'departments': [],
        'firstName': professor['first_name'],
        'lastName': professor['last_name'],
        'professorId': professor['professor_id'],
    }

    seen_department_ids = []  # prevents duplicate departments
    if 'department_ids' in professor:
        for id, name in zip(flask.json.loads(professor['department_ids']),
                            flask.json.loads(professor['department_names'])):
            if id not in seen_department_ids:
                professor_json['departments'].append({
                    'departmentId': id,
                    'departmentName': name
                })
                seen_department_ids.append(id)

    if 'badges' in professor:
        for badge in flask.json.loads(professor['badges']):
            if badge and badge not in professor_json['badges']:
                professor_json['badges'].append(badge)

    return professor_json


@professor_blueprint.route('/<int:professor_id>', methods=['GET'])
def professor_info(professor_id):
    basic_info = load_professor_basic_info_by_id(professor_id)
    if not basic_info:
        return {'error': 'Missing professor basic info'}, 400

    courses = load_professor_courses(professor_id)
    professor_courses_json = [{
        'courseId': course['course_id'],
        'courseName': course['name'],
        'courseCallNumber': course['call_number']
    } for course in courses]

    professor_summary_json = {
        'firstName': basic_info[0]['first_name'],
        'lastName': basic_info[0]['last_name'],
        'badges': [badge for badge in flask.json.loads(basic_info[0]['badges'])
                   if badge],
        'courses': professor_courses_json,
    }

    ip = flask.request.remote_addr
    professor_query_prefix = prepare_professor_query_prefix(professor_id)

    professor_review_highlight = load_review_highlight(
        professor_query_prefix, ip)

    professor_review_highlight_json = [parse_review(review, 'professor')
                                       for review
                                       in professor_review_highlight]

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

    courses_json = [{
        'text': course['name'],
        'value': course['course_id'],
        'key': course['name']
    } for course in courses]

    return {'courses': courses_json}
