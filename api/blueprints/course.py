import flask

from api.data.dataloaders.courses_loader import get_course, \
    get_department_professors
from api.data.dataloaders.reviews_loader import get_reviews_with_query_prefix,\
    prepare_course_query_prefix
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
                with most agreed votes (at least 0 votes)
            - Most negative review is the review with the lowest rating
                with most agreed votes (at least 0 votes)
            - When the two reviews are the Most Agreed Review is shown
            - When there is only one review, the Most Agreed Review is shown
            - When there are no reviews, then no review is shown
    '''
    ip = flask.request.remote_addr
    review_type = 'course'
    query_prefix = prepare_course_query_prefix(course_id)

    positive_reviews = get_reviews_with_query_prefix(
        query_prefix,
        ip,
        sort_criterion='rating',
        sort_order='DESC'
    )
    negative_reviews = get_reviews_with_query_prefix(
        query_prefix,
        ip,
        sort_criterion='rating',
        sort_order='ASC'
    )

    if positive_reviews:
        highest_rating = positive_reviews[0]['rating']
        most_positive_reviews = [
            r for r in positive_reviews if r['rating'] == highest_rating
        ]
        most_positive_review = sorted(
            most_positive_reviews, key=lambda k: k['agrees'], reverse=True)[0]
        parsed_most_positive_review = parse_review(
            most_positive_review, review_type)
    if negative_reviews:
        lowest_rating = negative_reviews[0]['rating']
        most_negative_reviews = [
            r for r in negative_reviews if r['rating'] == lowest_rating
        ]
        most_negative_review = sorted(
            most_negative_reviews, key=lambda k: k['agrees'], reverse=True)[0]
        parsed_most_negative_review = parse_review(
            most_negative_review, review_type)

    if positive_reviews and negative_reviews:
        if most_positive_review['review_id'] == \
                most_negative_review['review_id']:
            review_summary_json = {
                'mostAgreedReview': parsed_most_positive_review
            }
        else:
            review_summary_json = {
                'positiveReview': parsed_most_positive_review,
                'negativeReview': parsed_most_negative_review,
            }
    elif positive_reviews:
        review_summary_json = {
            'mostAgreedReview': parsed_most_positive_review,
        }
    elif negative_reviews:
        review_summary_json = {
            'mostAgreedReview': parsed_most_negative_review,
        }
    else:
        review_summary_json = {}

    return {
        'courseSummary': course_summary_json,
        'reviewSummary': review_summary_json
    }
