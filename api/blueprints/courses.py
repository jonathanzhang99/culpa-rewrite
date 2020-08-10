from collections import defaultdict
import flask

from api.data.dataloaders.courses_loader import get_course, get_department_professors

courses_blueprint = flask.Blueprint('courses_blueprint', __name__)


@courses_blueprint.route('/<course_id>', methods=['GET'])
def course_summary(course_id):
    # Fetch course info and all related professors
    try:
        course = get_course(course_id)[0]
        department_professors = get_department_professors(course_id)
    except Exception:
        return {'courseSummary': {
            'courseName': "",
            'courseCallNumber': "",
            'departmentName': "",
            'associatedProfessors': [],
        }}, 400

    associated_professors = {}
    for pd in department_professors:
        professor_id = pd['professor_id']
        if pd['professor_id'] not in associated_professors.keys():
            associated_professors[professor_id] = {
                'first_name': pd['first_name'],
                'last_name': pd['last_name'],
                'departments': [{
                    'department_id': pd['department_id'],
                    'name': pd['name'],
                }]
            }
        else:
            # the professor belongs to multiple departments
            associated_professors[professor_id]['departments'].append({
                'department_id': pd['department_id'],
                'name': pd['name'],
            })

    # Structure of associated_professors:
    #   associated_professor = {1: {'first_name': 'Nakul',
    #                             'last_name': 'Verma',
    #                             'departments': [{'department_id': 2,
    #                                             'name': 'Computer Science'},
    #                                            ... ]},
    #                          ... }

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
