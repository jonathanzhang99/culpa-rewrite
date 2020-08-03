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
    num_course_instances = 3
    course = loader.get_course(course_id)[0]
    department = loader.get_department(course['department_id'])[0]
    recent_course_instances = loader.get_recent_course_instances(
        course_id, num_course_instances)
    associated_professors = loader.get_prof_by_course(course_id)

    course_summary_json = {
        'courseName': course['name'],
        'departmentName': department['name'],
        'associatedProfessors': [{
            'firstName': professor['first_name'],
            'lastName': professor['last_name'],
            'professorId': professor['professor_id'],
            'year': professor['year'],
            'semester': professor['semester']
        } for professor in associated_professors]
    }
    return {'courseSummary': course_summary_json}
