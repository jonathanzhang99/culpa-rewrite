import datetime
from unittest import mock

from pymysql.err import IntegrityError

from api.data.datawriters.reviews_writer import insert_review
from api.tests import LoadersWritersBaseTest
from api.tests.data_tests.common import setup_department_professor_courses

NOW = datetime.datetime.utcnow().replace(microsecond=0)


class ReviewsLoaderTest(LoadersWritersBaseTest):
    @mock.patch('api.data.datawriters.reviews_writer.datetime')
    def test_insert_valid_review(self, mock_datetime):
        mock_datetime.datetime.utcnow.return_value = NOW
        setup_department_professor_courses(self.cur)

        VERMA_MACHINE_LEARNING_ID = 1

        insert_review(
            VERMA_MACHINE_LEARNING_ID,
            'gr8 class verma',
            'i luv ml',
            5,
            '127.0.0.1'
        )

        self.cur.execute(
            'SELECT * FROM review WHERE review.review_id = 1'
        )
        results = self.cur.fetchall()

        expected_res = {
            'review_id': 1,
            'course_professor_id': VERMA_MACHINE_LEARNING_ID,
            'content': 'gr8 class verma',
            'workload': 'i luv ml',
            'rating': 5,
            'ip': '127.0.0.1',
            'submission_date': NOW
        }
        self.assertEqual(len(results), 1)
        self.assertEqual(expected_res, results[0])

    @mock.patch('api.data.datawriters.reviews_writer.datetime')
    def test_insert_review_with_invalid_course_professor(self, mock_datetime):
        mock_datetime.datetime.utcnow.return_value = NOW
        setup_department_professor_courses(self.cur)

        # no course_professor with course_professor_id = 1000 should exist
        self.assertRaises(IntegrityError, insert_review,
                          1000, 'gr8 class that no exist', 'this is fake', 1,
                          'fake_ip')
