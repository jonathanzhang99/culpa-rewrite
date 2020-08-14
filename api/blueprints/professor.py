import flask

from api.data.dataloaders.professors_loader import get_all_professors, \
    get_professor_courses

professor_blueprint = flask.Blueprint('professor_blueprint', __name__)


@professor_blueprint.route('/all', methods=['GET'])
def all_professors():
    professors = get_all_professors()
    professors_json = [{
        'firstName': professor['first_name'],
        'lastName': professor['last_name']
    } for professor in professors]

    return {'professors': professors_json}


@professor_blueprint.route('/<id>/courses', methods=['GET'])
def professor_courses(id):
    courses = get_professor_courses(id)

    # TODO: (Sungbin, JZ) change json to conform to frontend props spec
    courses_json = [{
        'text': course['name'],
        'value': course['course_professor_id'],
        'key': course['name']
    } for course in courses]

    return {'courses': courses_json}
