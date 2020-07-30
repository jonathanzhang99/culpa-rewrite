import flask

from api.data.dataloaders.departments_loader import get_all_departments
from api.data.dataloaders.departments_loader import get_department_courses
from api.data.dataloaders.departments_loader import get_department_professors

departments_blueprint = flask.Blueprint('departments_blueprint', __name__)


@departments_blueprint.route('/all', methods=['GET'])
def all_departments():
    departments = get_all_departments()
    departments_json = [{
        'id': department['department_id'],
        'name': department['name']
    } for department in departments]

    return {'departments': departments_json}


@departments_blueprint.route('/<department_id>', methods=['GET'])
def department_info(department_id):
    courses = get_department_courses(department_id)
    courses_json = [{
        'name': course['name']
    } for course in courses]

    professors = get_department_professors(department_id)
    professors_json = [{
        'firstName': professor['first_name'],
        'lastName': professor['last_name']
    } for professor in professors]

    return {'courses': courses_json, 'professors': professors_json}
