import datetime
from unittest import mock

from pymysql.err import IntegrityError

from api.data import db
from api.data.datawriters.reviews_writer import insert_review
from api.tests import LoadersWritersBaseTest
from api.tests.data_tests.common import setup_department_professor_courses, \
    setup_users

NOW = datetime.datetime.utcnow().replace(microsecond=0)


@mock.patch('api.data.datawriters.reviews_writer.datetime')
class ReviewsWriterTest(LoadersWritersBaseTest):
    VERMA_PROFESSOR_ID = 1
    VERMA_MACHINE_LEARNING_ID = 1
    MACHINE_LEARNING_COURSE_ID = 1
    FREEDOM_OF_SPEECH_COURSE_ID = 5

    COMPUTER_SCIENCE_DEPARTMENT_ID = 1
    LAW_DEPARTMENT_ID = 2

    NEW_PROFESSOR_ID = 7
    NEW_COURSE_ID = 9
    NEW_REVIEW_ID = 1
    NEW_COURSE_PROFESSOR_ID = 10

    def setUp(self):
        super().setUp()
        setup_department_professor_courses(self.cur)
        setup_users(self.cur)
        db.commit()

    def test_insert_valid_review(self, mock_datetime):
        mock_datetime.datetime.utcnow.return_value = NOW
        insert_review(
            self.VERMA_MACHINE_LEARNING_ID,
            'gr8 class verma',
            'i luv ml',
            5,
            '127.0.0.1'
        )

        self.cur.execute(
            'SELECT * FROM review WHERE review.review_id = %s',
            self.NEW_REVIEW_ID
        )
        results = self.cur.fetchall()

        expected_res = {
            'review_id': 1,
            'course_professor_id': self.VERMA_MACHINE_LEARNING_ID,
            'content': 'gr8 class verma',
            'workload': 'i luv ml',
            'rating': 5,
            'ip': '127.0.0.1',
            'submission_date': NOW
        }
        self.assertEqual(len(results), 1)
        self.assertDictEqual(expected_res, results[0])

    def test_insert_valid_review_adds_pending_flag(self, mock_datetime):
        mock_datetime.datetime.utcnow.return_value = NOW

        insert_review(
            self.VERMA_MACHINE_LEARNING_ID,
            'gr8 class verma',
            'i luv ml',
            5,
            '127.0.0.1'
        )

        row_count = self.cur.execute(
            'SELECT * FROM flag WHERE flag.review_id = %s',
            self.NEW_REVIEW_ID
        )

        self.assertEqual(row_count, 1)

    def test_insert_review_with_invalid_course_professor(self, mock_datetime):
        mock_datetime.datetime.utcnow.return_value = NOW
        # no course_professor with course_professor_id = 1000 should exist in
        # test data
        self.assertRaises(IntegrityError, insert_review,
                          1000, 'gr8 nonexistent class', 'this is fake', 1,
                          'fake_ip')
