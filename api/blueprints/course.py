import flask

from api.data.dataloaders.courses_loader import get_course, \
    get_department_professors
from api.data.dataloaders.reviews_loader import prepare_course_query_prefix,\
    get_course_review_summary
from api.blueprints.review import parse_review

course_blueprint = flask.Blueprint('course_blueprint', __name__)


@course_blueprint.route('/<int:course_id>', methods=['GET'])
def course_summary(course_id):
    # Fetch course info and all related professors
    course = get_course(course_id)
    department_professors = get_department_professors(course_id)

    # Check for null course
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

    '''
     Fetch review summary info
        NOTE:
            - Most positive review is the review with the highest rating
                with most agreed votes (at least 1 vote)
            - Most negative review is the review with the lowest rating
                with most agreed votes (at least 1 vote)
            - When the two reviews are the Most Agreed Review is shown
            - When there is only one review, the Most Agreed Review is shown
            - When there are no reviews, then no review is shown
    '''
    ip = flask.request.remote_addr
    review_type = 'course'
    query_prefix = prepare_course_query_prefix(course_id)
    review_summary = get_course_review_summary(query_prefix, ip)

    if len(review_summary) == 0:
        review_summary_json = {}
    elif len(review_summary) == 1:
        review_summary_json = {
            'mostAgreedReview': parse_review(review_summary[0], review_type)
        }
    else:
        review_summary_json = {
            'positiveReview': parse_review(review_summary[0], review_type),
            'negativeReview': parse_review(review_summary[1], review_type),
        }

    return {
        'courseSummary': course_summary_json,
        'reviewSummary': review_summary_json
    }
