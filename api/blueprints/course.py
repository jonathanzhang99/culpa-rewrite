import flask

from api.data.dataloaders.courses_loader import load_course_basic_info, \
    load_course_professors
from api.data.dataloaders.reviews_loader import prepare_course_query_prefix,\
    load_review_highlight
from api.data.dataloaders.professors_loader import load_professor_badges
from api.blueprints.review import parse_review
from api.blueprints.professor import parse_professors

course_blueprint = flask.Blueprint('course_blueprint', __name__)


@course_blueprint.route('/<int:course_id>', methods=['GET'])
def course_info(course_id):
    basic_info = load_course_basic_info(course_id)
    if not basic_info:
        return {'error': 'Missing course basic info'}, 404

    # The load_course_professors loader returns a list of professors who teach
    # the course, and departments they teach in. Duplicate entries exist for
    # professors who appear in multiple departments.
    # Here we reformat into the JSON course_professors, so that each professor
    # is uniquely identified by id and has professorDepartments as a subfield.
    professors = load_course_professors(course_id)
    professors_json = parse_professors(professors)

    course_professors_json = []
    for professor in professors_json:  # rename keys
        course_professors_json.append({
            'badges': professor['badges'],
            'firstName': professor['firstName'],
            'lastName': professor['lastName'],
            'professorId': professor['professorId'],
            'professorDepartments': [{
                'professorDepartmentId': department['departmentId'],
                'professorDepartmentName': department['departmentName'],
            } for department in professor['departments']],
        })

    course_summary_json = {
        'courseName': basic_info[0]['name'],
        'courseCallNumber': basic_info[0]['call_number'],
        'departmentId': basic_info[0]['department_id'],
        'departmentName': basic_info[0]['department_name'],
        'courseProfessors': course_professors_json,
    }

    ip = flask.request.remote_addr
    query_prefix = prepare_course_query_prefix(course_id)

    course_review_highlight = load_review_highlight(query_prefix, ip)

    course_review_highlight_json = []
    for review in course_review_highlight:
        review_json = parse_review(review, 'course')
        # fetch badges of each professor
        badges = load_professor_badges(review_json['reviewHeader']['profId'])
        for badge in badges:
            review_json['reviewHeader']['badges'].append(badge['badge_id'])
        course_review_highlight_json.append(review_json)

    return {
        'courseSummary': course_summary_json,
        'courseReviewHighlight': course_review_highlight_json
    }
