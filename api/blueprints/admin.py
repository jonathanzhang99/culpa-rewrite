import flask

from api.data.dataloaders.courses_loader import count_pending_courses
from api.data.dataloaders.professors_loader import count_pending_professors
from api.data.dataloaders.relationships_loader import \
    count_pending_course_professor_relationships
from api.data.dataloaders.reviews_loader import count_pending_reviews
from api.data.datawriters.reviews_writer import approve_review, reject_review


admin_blueprint = flask.Blueprint('admin_blueprint', __name__)


# change 'rejected' with 'libel' and 'insufficient' in the future version
# when 'escalate' feature is implemented
DECISION_KEY = {'approved': 1, 'rejected': 2}


@admin_blueprint.route('/dashboard', methods=['GET'])
def dashboard():
    pending_reviews_count = count_pending_reviews()
    pending_professors_count = count_pending_professors()
    pending_courses_count = count_pending_courses()
    pending_relationships = count_pending_course_professor_relationships()

    return {
      'pendingReviewsCount': pending_reviews_count['count'],
      'pendingProfessorsCount': pending_professors_count['count'],
      'pendingCoursesCount': pending_courses_count['count'],
      'pendingRelationshipsCount': pending_relationships['count']
    }


@admin_blueprint.route('/submit/<int:review_id>', methods=['POST'])
def submit_decision(review_id):
    if not flask.request.is_json:
        return {'error': 'Missing JSON in request'}, 422

    request_json = flask.request.get_json()

    try:
        decision = request_json['decision']
    except KeyError:
        return {'error': 'Missing inputs'}, 400

    # change 'rejected' with 'libel' and 'insufficient' in the future version
    # when 'escalate' feature is implemented
    if decision == DECISION_KEY['approved']:
        approve_review(review_id)
    elif decision == DECISION_KEY['rejected']:
        reject_review(review_id)

    return {'review_id': review_id}
