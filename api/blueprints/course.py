import flask

from api.data.dataloaders.courses_loader import load_course_basic_info, \
    load_course_professors
from api.data.dataloaders.reviews_loader import prepare_course_query_prefix,\
    get_course_review_summary
from api.blueprints.review import parse_review

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

    course_summary_json = {
        'courseName': basic_info[0]['name'],
        'courseCallNumber': basic_info[0]['call_number'],
        'departmentId': basic_info[0]['department_id'],
        'departmentName': basic_info[0]['department_name'],
        'courseProfessors': list(course_professors.values())
    }

    #  Fetch review highlight info
    #     NOTE:
    #         - Most positive review is the review with the highest rating
    #             with most agreed votes (at least 1 vote)
    #         - Most negative review is the review with the lowest rating
    #             with most agreed votes (at least 1 vote)
    #         - When the two reviews are the Most Agreed Review is shown
    #         - When there is only one review, the Most Agreed Review is shown
    #         - When there are no reviews, then no review is shown
    ip = flask.request.remote_addr
    review_type = 'course'
    query_prefix = prepare_course_query_prefix(course_id)
    review_highlight = get_course_review_summary(query_prefix, ip)

    if len(review_highlight) == 0:
        review_highlight_json = {}
    elif len(review_highlight) == 1:
        review_highlight_json = {
            'mostAgreedReview': parse_review(review_highlight[0], review_type)
        }
    else:
        review_highlight_json = {
            'positiveReview': parse_review(review_highlight[0], review_type),
            'negativeReview': parse_review(review_highlight[1], review_type),
        }

    return {
        'courseSummary': course_summary_json,
        'reviewHighlight': review_highlight_json
    }
