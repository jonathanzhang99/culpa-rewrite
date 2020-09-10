import flask

from api.data.dataloaders.professors_loader import load_professor_courses, \
     load_professor_basic_info_by_id
from api.data.dataloaders.reviews_loader import \
    prepare_professor_query_prefix, load_review_highlight
from api.blueprints.review import parse_review

professor_blueprint = flask.Blueprint('professor_blueprint', __name__)


def parse_professors(professors, isOrdered=False):
    '''
    static method for parsing professors into json objects
    '''
    professors_json = {}

    professor_id_order = []  # preserves order of search results (optional)
    department_ids = []      # prevents duplicate departments
    for professor in professors:
        professor_id = professor['professor_id']
        if professor_id not in professors_json:  # new professor
            professors_json[professor_id] = {
                'badges': [],
                'departments': [],
                'firstName': professor['first_name'],
                'lastName': professor['last_name'],
                'professorId': professor_id,
            }
            professor_id_order.append(professor_id)
            department_ids = []

        if 'department_id' in professor:
            department_id = professor['department_id']
            if department_id not in department_ids:
                professors_json[professor_id]['departments'].append({
                   'departmentId': professor['department_id'],
                   'departmentName': professor['department_name'],
                })
                department_ids.append(department_id)

        if 'badge_id' in professor:
            badge_id = professor['badge_id']
            badge_ids = professors_json[professor_id]['badges']
            if badge_id and badge_id not in badge_ids:
                professors_json[professor_id]['badges'].append(badge_id)

    if isOrdered:
        ordered_professors = []
        for professor_id in professor_id_order:
            ordered_professors.append(professors_json[professor_id])
        return ordered_professors

    return list(professors_json.values())


@professor_blueprint.route('/<int:professor_id>', methods=['GET'])
def professor_info(professor_id):
    name = load_professor_basic_info_by_id(professor_id)
    if not name:
        return {'error': 'Missing professor name'}, 400
    badges = [badge['badge_id'] for badge in name if badge['badge_id']]

    courses = load_professor_courses(professor_id)
    courses_json = [{
        'courseId': course['course_id'],
        'courseName': course['name'],
        'courseCallNumber': course['call_number']
    } for course in courses]

    professor_summary_json = {
        'firstName': name[0]['first_name'],
        'lastName': name[0]['last_name'],
        'badges': badges,
        'courses': courses_json,
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

    courses_json = [{
        'text': course['name'],
        'value': course['course_id'],
        'key': course['name']
    } for course in courses]

    return {'courses': courses_json}
