import flask

from api.data.dataloaders.departments_loader import load_all_departments, \
    load_department_courses, load_department_name, load_department_professors

department_blueprint = flask.Blueprint('department_blueprint', __name__)


@department_blueprint.route('/all', methods=['GET'])
def all_departments():
    '''
    Returns a list of department dictionaries. If the option parameter
    is specified in the url arguments, then the key names are changed
    to match the required names for the frontend Dropdown i.e. the
    following format:
        {
            'text': str
            'value': int
            'key': int
        }
    '''
    format_as_option = flask.request.args.get('option')

    id_key, name_key = 'departmentId', 'departmentName'
    if format_as_option:
        id_key, name_key = 'value', 'text'

    departments = load_all_departments()
    departments_json = [{
        id_key: department['department_id'],
        name_key: department['name']
    } for department in departments]

    # add key for frontend option
    if format_as_option:
        departments_json = [dict(department_json, key=department_json[id_key])
                            for department_json in departments_json]

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
