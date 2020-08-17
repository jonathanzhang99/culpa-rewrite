import flask

from api.data.dataloaders.professors_loader import get_professor_courses, \
     get_professor_name

professor_blueprint = flask.Blueprint('professor_blueprint', __name__)


@professor_blueprint.route('/<professor_id>', methods=['GET'])
def professor_summary(professor_id):
    '''
    Fetch professor name and courses taught to display on professor info page
    '''
    # TODO: Fetch professor nugget status

    name = get_professor_name(professor_id)
    if name == []:
        return {'error': 'Missing professor name'}, 400

    courses = get_professor_courses(professor_id)
    courses_json = [{
        'courseProfessorId': course['course_professor_id'],
        'courseName': course['name'],
        'courseCallNumber': course['call_number']
    } for course in courses]

    return {
        'firstName': name[0]['first_name'],
        'lastName': name[0]['last_name'],
        'courses': courses_json
    }


@professor_blueprint.route('/<professor_id>/courses', methods=['GET'])
def professor_courses(professor_id):
    '''
    This route is used when choosing among a professor's courses to review in
    the 'Write A Review' flow rather than to display on the professor info page
    '''
    courses = get_professor_courses(professor_id)

    # TODO: (Sungbin, JZ) change json to conform to frontend props spec
    courses_json = [{
        'text': course['name'],
        'value': course['course_professor_id'],
        'key': course['name']
    } for course in courses]

    return {'courses': courses_json}
