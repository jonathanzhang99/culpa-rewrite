import flask

from api.data.dataloaders.courses_loader import get_course, \
    get_department_professors

course_blueprint = flask.Blueprint('course_blueprint', __name__)


@course_blueprint.route('/<course_id>', methods=['GET'])
def course_summary(course_id):
    # Fetch course info and all related professors
    try:
        course = get_course(course_id)
        department_professors = get_department_professors(course_id)
    except Exception:
        return {'error': 'db error occurred'}, 400

    # Access the only element here to prevent IndexError being handled
    # as DB error
    try:
        course = course[0]
    except IndexError:
        return {'error': 'course not found'}, 404

    associated_professors = {}
    for dp_row in department_professors:
        professor_id = dp_row['professor_id']
        if not associated_professors.get(professor_id):
            associated_professors[professor_id] = {
                'first_name': dp_row['first_name'],
                'last_name': dp_row['last_name'],
                'departments': []
            }

        associated_professors[professor_id]['departments'].append({
            'department_id': dp_row['department_id'],
            'name': dp_row['name'],
        })

    course_summary_json = {
        'courseName': course['name'],
        'courseCallNumber': course['call_number'],
        'departmentId': course['department_id'],
        'departmentName': course['department_name'],
        'associatedProfessors': [{
            'firstName': professor['first_name'],
            'lastName': professor['last_name'],
            'professorId': professor_id,
            'profDepartments': [{
                'profDepartmentId': department['department_id'],
                'profDepartmentName': department['name']
            } for department in professor['departments']],
        } for professor_id, professor in associated_professors.items()],
    }
    return {'courseSummary': course_summary_json}
