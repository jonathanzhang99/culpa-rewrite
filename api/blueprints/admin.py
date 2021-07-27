import flask

from api.data.dataloaders.courses_loader import count_pending_courses
from api.data.dataloaders.professors_loader import count_pending_professors
from api.data.dataloaders.relationships_loader import \
    count_pending_course_professor_relationships
from api.data.dataloaders.reviews_loader import count_pending_reviews


admin_blueprint = flask.Blueprint('admin_blueprint', __name__)


@admin_blueprint.route('/dashboard', methods=['GET'])
def dashboard():
    pending_reviews_count = count_pending_reviews()
    pending_professors_count = count_pending_professors()
    pending_courses_count = count_pending_courses()
    pending_relationships_count = \
    count_pending_course_professor_relationships()

    return {
      'pendingReviewsCount': pending_reviews_count['count'],
      'pendingProfessorsCount': pending_professors_count['count'],
      'pendingCoursesCount': pending_courses_count['count'],
      'pendingRelationshipsCount': pending_relationships_count['count']
    }
