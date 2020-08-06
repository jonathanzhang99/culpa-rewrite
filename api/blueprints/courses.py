from collections import defaultdict
import flask

import api.data.dataloaders.courses_loader as loader

courses_blueprint = flask.Blueprint('courses_blueprint', __name__)


@courses_blueprint.route('/all', methods=['GET'])
def all_courses():
    courses = loader.get_all_courses()
    courses_json = [{
        'name': course['name'],
        'department_id': course['department_id']
    } for course in courses]

    return {'courses': courses_json}


@courses_blueprint.route('/<course_id>', methods=['GET'])
def course_summary(course_id):
    course = loader.get_course(course_id)[0]
    department = loader.get_department(course['department_id'])[0]
    associated_professors = loader.get_prof_by_course(course_id)
    professor_ids = [professor['professor_id']
                     for professor in associated_professors]
    departments = loader.get_department_by_prof(professor_ids)

    # Convert to form {1: [{2, 'Computer Scinece'}]}, where 1 is professor_id
    # and 2 is department_id
    department_dict = defaultdict(list)
    for d in departments:
        for key, value in d.items():
            if key == 'professor_id':
                department_dict[value].append(
                    {'department_id': d['department_id'],
                     'name': d['name']})

    # Include departments in associated professors
    for professor in associated_professors:
        professor_id = professor['professor_id']
        professor['departments'] = department_dict[professor_id]

    # Structure of associated_professors:
    #   associated_professor = [{'first_name': 'Nakul',
    #                             'last_name': 'Verma',
    #                             'professor_id': 1,
    #                             'departments': [{'department_id': 2,
    #                                             'name': 'Computer Science'},
    #                                            ... ]},
    #                          ... ]

    course_summary_json = {
        'courseName': course['name'],
        'courseCallNumber': course['call_number'],
        'departmentId': course['department_id'],
        'departmentName': department['name'],
        'associatedProfessors': [{
            'firstName': professor['first_name'],
            'lastName': professor['last_name'],
            'professorId': professor['professor_id'],
            'profDepartments': [{
                'profDepartmentId': department['department_id'],
                'profDepartmentName': department['name']
            } for department in professor['departments']],
        } for professor in associated_professors],
    }
    return {'courseSummary': course_summary_json}
