import flask

from api.data.dataloaders.professors_loader import get_all_professors, \
    get_professor_courses

professors_blueprint = flask.Blueprint('professors_blueprint', __name__)


@professors_blueprint.route('/all', methods=['GET'])
def all_professors():
    professors = get_all_professors()
    professors_json = [{
        'firstName': professor['first_name'],
        'lastName': professor['last_name']
    } for professor in professors]

    return {'professors': professors_json}


@professors_blueprint.route('/<id>/courses', methods=['GET'])
def get_courses(id):
    courses = get_professor_courses(id)
    courses_json = [{
        'id': course['course_professor_id'],
        'text': course['name'],
        'value': course['course_professor_id'],
        'key': course['name']
    } for course in courses]

    return {'courses': courses_json}
