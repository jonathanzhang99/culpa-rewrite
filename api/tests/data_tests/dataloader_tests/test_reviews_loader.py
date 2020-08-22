from api.tests import LoadersWritersBaseTest
from api.tests.data_tests.common import setup_votes
from api.data.dataloaders.reviews_loader import get_course_review_summary


class ReviewsLoaderTest(LoadersWritersBaseTest):
    def test_get_course_review_summary(self):
        setup_votes(self.cur)
        course_id = 5
        ip = ''
        print(get_course_review_summary(course_id, ip))

    def test_get_course_review_summary_all_neutrals(self):
        setup_votes(self.cur)
        course_id = 2
        ip = ''
        print(get_course_review_summary(course_id, ip))
