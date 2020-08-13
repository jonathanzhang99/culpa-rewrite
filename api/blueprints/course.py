import flask

from api.data.dataloaders.courses_loader import get_course, \
    get_department_professors

course_blueprint = flask.Blueprint('course_blueprint', __name__)


@course_blueprint.route('/<course_id>', methods=['GET'])
def course_summary(course_id):
    # Fetch course info and all related professors
    course = get_course(course_id)
    department_professors = get_department_professors(course_id)

    # Access the only element here to prevent IndexError being handled
    # as DB error
    if not course:
        return {'error': 'course not found'}, 404

    course = course[0]
    associated_professors = {}
    for dp_row in department_professors:
        professor_id = dp_row['professor_id']
        if not associated_professors.get(professor_id):
            associated_professors[professor_id] = {
                'firstName': dp_row['first_name'],
                'lastName': dp_row['last_name'],
                'profDepartments': [],
                'professorId': professor_id,
            }

        associated_professors[professor_id]['profDepartments'].append({
            'profDepartmentId': dp_row['department_id'],
            'profDepartmentName': dp_row['name'],
        })

    course_summary_json = {
        'courseName': course['name'],
        'courseCallNumber': course['call_number'],
        'departmentId': course['department_id'],
        'departmentName': course['department_name'],
        'associatedProfessors': list(associated_professors.values()),
    }
    return {'courseSummary': course_summary_json}
