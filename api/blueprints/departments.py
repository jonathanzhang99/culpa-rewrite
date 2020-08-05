import flask

from api.data.dataloaders.departments_loader import get_all_departments, \
    get_department_courses, get_department_name, get_department_professors

departments_blueprint = flask.Blueprint('departments_blueprint', __name__)


@departments_blueprint.route('/all', methods=['GET'])
def all_departments():
    departments = get_all_departments()
    departments_json = [{
        'departmentId': department['department_id'],
        'departmentName': department['name']
    } for department in departments]

    return {'departments': departments_json}


@departments_blueprint.route('/<department_id>', methods=['GET'])
def department_info(department_id):
    name = get_department_name(department_id)

    if name == [] or 'name' not in name[0]:
        return {'error': 'Missing department name'}, 400
    name_str = name[0]['name']

    courses = get_department_courses(department_id)
    courses_json = [{
        'courseId': course['course_id'],
        'courseName': course['name']
    } for course in courses]

    professors = get_department_professors(department_id)
    professors_json = [{
        'professorId': professor['professor_id'],
        'firstName': professor['first_name'],
        'lastName': professor['last_name']
    } for professor in professors]

    return {'departmentName': name_str,
            'departmentCourses': courses_json,
            'departmentProfessors': professors_json}
