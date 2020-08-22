import flask

from api.data.dataloaders.courses_loader import load_course_basic_info, \
    load_course_professors

course_blueprint = flask.Blueprint('course_blueprint', __name__)


@course_blueprint.route('/<course_id>', methods=['GET'])
def course_summary(course_id):
    basic_info = load_course_basic_info(course_id)
    if not basic_info:
        return {'error': 'Missing course basic info'}, 404

    # The load_course_professors loader returns a list of professors who teach
    # the course, and departments they teach in. Duplicate entries exist for
    # professors who appear in multiple departments.
    # Here we reformat into the JSON course_professors, so that each professor
    # is uniquely identified by id and has professorDepartments as a subfield.
    professors = load_course_professors(course_id)
    course_professors = {}
    for professor in professors:
        professor_id = professor['professor_id']
        if professor_id not in course_professors:
            course_professors[professor_id] = {
                'firstName': professor['first_name'],
                'lastName': professor['last_name'],
                'professorId': professor_id,
                'professorDepartments': []
            }
        course_professors[professor_id]['professorDepartments'].append({
            'professorDepartmentId': professor['department_id'],
            'professorDepartmentName': professor['name']
        })

    return {
        'courseName': basic_info[0]['name'],
        'courseCallNumber': basic_info[0]['call_number'],
        'departmentId': basic_info[0]['department_id'],
        'departmentName': basic_info[0]['department_name'],
        'courseProfessors': list(course_professors.values())
    }
