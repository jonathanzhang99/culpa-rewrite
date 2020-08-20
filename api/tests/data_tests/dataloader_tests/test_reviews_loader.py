from api.tests import LoadersWritersBaseTest
from api.tests.data_tests.common import setup_votes
from api.data.dataloaders.reviews_loader import get_review_ids, \
    get_most_negative_reviews, get_most_positive_reviews


class ReviewsLoaderTest(LoadersWritersBaseTest):
    def test_get_review_ids(self):
        setup_votes(self.cur)
        course_id = 5
        print(get_review_ids(course_id))

    def test_get_most_positive_reviews(self):
        setup_votes(self.cur)
        course_id = 5
        ip = ''
        print(get_most_positive_reviews(course_id, ip))

    def test_get_most_negative_reviews(self):
        setup_votes(self.cur)
        course_id = 5
        ip = ''
        print(get_most_negative_reviews(course_id, ip))
