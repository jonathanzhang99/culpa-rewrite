import datetime
from unittest import mock

from pymysql.err import IntegrityError

from api.data import db
from api.data.datawriters.reviews_writer import add_course_professor, \
    insert_review
from api.tests import LoadersWritersBaseTest
from api.tests.data_tests.common import setup_department_professor_courses

NOW = datetime.datetime.utcnow().replace(microsecond=0)


@mock.patch('api.data.datawriters.reviews_writer.datetime')
class ReviewsWriterTest(LoadersWritersBaseTest):
    MACHINE_LEARNING_COURSE_ID = 1

    COMPUTER_SCIENCE_DEPARTMENT_ID = 1
    LAW_DEPARTMENT_ID = 2

    NEW_PROFESSOR_ID = 4
    MEW_COURSE_ID = 7

    VERMA_MACHINE_LEARNING_ID = 1

    def setUp(self):
        super().setUp()
        setup_department_professor_courses(self.cur)
        db.commit()

    def test_insert_valid_review(self, mock_datetime):
        mock_datetime.datetime.utcnow.return_value = NOW

        self.VERMA_MACHINE_LEARNING_ID = 1

        insert_review(
            self.VERMA_MACHINE_LEARNING_ID,
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
            'course_professor_id': self.VERMA_MACHINE_LEARNING_ID,
            'content': 'gr8 class verma',
            'workload': 'i luv ml',
            'rating': 5,
            'ip': '127.0.0.1',
            'submission_date': NOW
        }
        self.assertEqual(len(results), 1)
        self.assertEqual(expected_res, results[0])

    def test_insert_review_with_invalid_course_professor(self, mock_datetime):
        mock_datetime.datetime.utcnow.return_value = NOW
        # no course_professor with course_professor_id = 1000 should exist in
        # test data
        self.assertRaises(IntegrityError, insert_review,
                          1000, 'gr8 nonexistent class', 'this is fake', 1,
                          'fake_ip')

    def test_insert_new_professor_new_course(self, mock_datetime):
        mock_datetime.datetime.utcnow.return_value = NOW
        self.COMPUTER_SCIENCE_DEPARTMENT_ID = 1
        self.LAW_DEPARTMENT_ID = 2

        self.NEW_PROFESSOR_ID = 4
        self.NEW_COURSE_ID = 7

        new_professor_input = {
            'first_name': 'test_first_name',
            'last_name': 'test_last_name',
            'uni': 'test123',
            'department': self.COMPUTER_SCIENCE_DEPARTMENT_ID
        }

        new_course_input = {
            'name': 'test_new_course_name',
            'department': self.LAW_DEPARTMENT_ID,
            'code': 'new_course_code'
        }
        add_course_professor(new_professor_input, new_course_input)

        course_professor_rows = self.cur.execute(
            ('SELECT * FROM course_professor WHERE '
             'course_professor.course_id = %s AND '
             'course_professor.professor_id = %s'),
            [self.NEW_COURSE_ID, self.NEW_PROFESSOR_ID]
        )

        self.assertEqual(course_professor_rows, 1)

        self.cur.execute(
            'SELECT * FROM professor WHERE professor.professor_id = %s',
            self.NEW_PROFESSOR_ID
        )

        new_professor_result = self.cur.fetchall()
        expected_professor_res = {
            'professor_id': self.NEW_PROFESSOR_ID,
            'first_name': 'test_first_name',
            'last_name': 'test_last_name',
            'uni': 'test123'
        }

        self.assertEqual(new_professor_result[0], expected_professor_res)

        self.cur.execute(
            'SELECT * FROM course WHERE course.course_id = %s',
            self.NEW_COURSE_ID
        )
        new_course_result = self.cur.fetchall()
        expected_course_res = {
            'course_id': self.NEW_COURSE_ID,
            'name': 'test_new_course_name',
            'call_number': 'new_course_code',
            'department_id': self.LAW_DEPARTMENT_ID
        }

        self.assertEqual(new_course_result[0], expected_course_res)

        self.cur.execute(
            ('SELECT * FROM department_professor WHERE '
             'department_professor.professor_id = %s'),
            self.NEW_PROFESSOR_ID
        )

        professor_department_relationship = self.cur.fetchall()

        expected_professor_department_res = {
            'professor_id': self.NEW_PROFESSOR_ID,
            'department_id': self.COMPUTER_SCIENCE_DEPARTMENT_ID
        }

        self.assertEqual(len(professor_department_relationship), 1)
        self.assertEqual(professor_department_relationship[0],
                         expected_professor_department_res)

    def test_insert_new_professor_existing_course(self, mock_datetime):
        mock_datetime.datetime.utcnow.return_value = NOW
        self.MACHINE_LEARNING_COURSE_ID = 1
        self.COMPUTER_SCIENCE_DEPARTMENT_ID = 1
        self.NEW_PROFESSOR_ID = 4

        new_professor_input = {
            'first_name': 'test_first_name',
            'last_name': 'test_last_name',
            'uni': 'test123',
            'department': self.COMPUTER_SCIENCE_DEPARTMENT_ID
        }
        add_course_professor(new_professor_input,
                             self.MACHINE_LEARNING_COURSE_ID)
        db.commit()

        rows_returned = self.cur.execute(
            ('SELECT * FROM course_professor WHERE '
             'course_professor.course_id = %s AND '
             'course_professor.professor_id = %s'),
            [self.MACHINE_LEARNING_COURSE_ID, self.NEW_PROFESSOR_ID]
        )
        self.assertEqual(rows_returned, 1)

        self.cur.execute(
            'SELECT * FROM professor WHERE professor.professor_id = %s',
            self.NEW_PROFESSOR_ID
        )

        new_professor_result = self.cur.fetchall()

        expected_professor_res = {
            'professor_id': self.NEW_PROFESSOR_ID,
            'first_name': 'test_first_name',
            'last_name': 'test_last_name',
            'uni': 'test123'
        }

        self.assertEqual(new_professor_result[0], expected_professor_res)

        self.cur.execute(
            ('SELECT * FROM department_professor WHERE '
             'department_professor.professor_id = %s'),
            self.NEW_PROFESSOR_ID
        )

        professor_department_relationship = self.cur.fetchall()

        expected_professor_department_res = {
            'professor_id': self.NEW_PROFESSOR_ID,
            'department_id': self.COMPUTER_SCIENCE_DEPARTMENT_ID
        }

        self.assertEqual(len(professor_department_relationship), 1)
        self.assertEqual(professor_department_relationship[0],
                         expected_professor_department_res)

    def test_insert_existing_professor_existing_course(self, mock_datetime):
        mock_datetime.datetime.utcnow.return_value = NOW
        self.VERMA_PROFESSOR_ID = 1
        self.FREEDOM_OF_SPEECH_COURSE_ID = 5

        add_course_professor(self.VERMA_PROFESSOR_ID,
                             self.FREEDOM_OF_SPEECH_COURSE_ID)
        db.commit()

        rows_returned = self.cur.execute(
            ('SELECT * FROM course_professor WHERE '
             'course_professor.course_id = %s AND '
             'course_professor.professor_id = %s'),
            [self.FREEDOM_OF_SPEECH_COURSE_ID, self.VERMA_PROFESSOR_ID]
        )

        self.assertEqual(rows_returned, 1)

    def test_insert_existing_professor_new_course(self, mock_datetime):
        mock_datetime.datetime.utcnow.return_value = NOW
        self.VERMA_PROFESSOR_ID = 1

        self.NEW_COURSE_ID = 7
        self.LAW_DEPARTMENT_ID = 2

        new_course_input = {
            'name': 'test_new_course_name',
            'department': self.LAW_DEPARTMENT_ID,
            'code': 'new_course_code'
        }
        add_course_professor(self.VERMA_PROFESSOR_ID, new_course_input)
        db.commit()

        rows_returned = self.cur.execute(
            ('SELECT * FROM course_professor WHERE '
             'course_professor.course_id = %s AND '
             'course_professor.professor_id = %s'),
            [self.NEW_COURSE_ID, self.VERMA_PROFESSOR_ID]
        )
        self.assertEqual(rows_returned, 1)

        self.cur.execute(
            'SELECT * FROM course WHERE course.course_id = %s',
            self.NEW_COURSE_ID
        )
        new_course_result = self.cur.fetchall()
        expected_course_res = {
            'course_id': self.NEW_COURSE_ID,
            'name': 'test_new_course_name',
            'call_number': 'new_course_code',
            'department_id': self.LAW_DEPARTMENT_ID
        }
        self.assertEqual(new_course_result[0], expected_course_res)
