import flask

from api.data.dataloaders.departments_loader import load_all_departments, \
    load_department_courses, load_department_name, load_department_professors

department_blueprint = flask.Blueprint('department_blueprint', __name__)


@department_blueprint.route('/all', methods=['GET'])
def all_departments():
    departments = load_all_departments()
    departments_json = [{
        'departmentId': department['department_id'],
        'departmentName': department['name']
    } for department in departments]

    return {'departments': departments_json}


@department_blueprint.route('/<department_id>', methods=['GET'])
def department_info(department_id):
    name = load_department_name(department_id)

    if name == [] or 'name' not in name[0]:
        return {'error': 'Missing department name'}, 400
    name_str = name[0]['name']

    courses = load_department_courses(department_id)
    courses_json = [{
        'courseId': course['course_id'],
        'courseName': course['name']
    } for course in courses]

    professors = load_department_professors(department_id)
    professors_json = [{
        'professorId': professor['professor_id'],
        'firstName': professor['first_name'],
        'lastName': professor['last_name']
    } for professor in professors]

    return {
        'departmentName': name_str,
        'departmentCourses': courses_json,
        'departmentProfessors': professors_json
    }
