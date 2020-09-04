from api.data import db
from api.data.datawriters.course_professors_writer import \
    add_course_professor
from api.tests import LoadersWritersBaseTest
from api.tests.data_tests.common import setup_department_professor_courses, \
    setup_users


class CourseProfessorsWriterTest(LoadersWritersBaseTest):
    VERMA_PROFESSOR_ID = 1
    VERMA_UNI = 'nv2274'
    BOLLINGER_PROFESSOR_ID = 2

    MACHINE_LEARNING_COURSE_ID = 1
    INT_MACHINE_LEARNING_COURSE_ID = 7
    FREEDOM_OF_SPEECH_COURSE_ID = 5

    VERMA_MACHINE_LEARNING_ID = 1       # Approved
    VERMA_FREEDOM_OF_SPEECH_ID = 8      # Pending
    VERMA_INT_MACHINE_LEARNING_ID = 9   # Rejected

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

    def test_insert_new_professor_new_course(self):
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

        # insert course and professor
        add_course_professor(new_professor_input, new_course_input)

        # verify that the course instance relationship is written
        self.cur.execute(
            ('SELECT * FROM course_professor WHERE '
                'course_professor.course_id = %s AND '
                'course_professor.professor_id = %s'),
            [self.NEW_COURSE_ID, self.NEW_PROFESSOR_ID]
        )
        course_professor_result = self.cur.fetchone()
        expected_course_professor_result = {
            'course_professor_id': self.NEW_COURSE_PROFESSOR_ID,
            'course_id': self.NEW_COURSE_ID,
            'professor_id': self.NEW_PROFESSOR_ID,
            'status': 'pending'
        }
        self.assertDictEqual(expected_course_professor_result,
                             course_professor_result)

        # verify that the professor is written
        self.cur.execute(
            'SELECT * FROM professor WHERE professor.professor_id = %s',
            self.NEW_PROFESSOR_ID
        )

        new_professor_result = self.cur.fetchall()
        expected_professor_res = {
            'professor_id': self.NEW_PROFESSOR_ID,
            'first_name': 'test_first_name',
            'last_name': 'test_last_name',
            'status': 'pending',
            'uni': 'test123'
        }

        self.assertDictEqual(new_professor_result[0], expected_professor_res)

        # verify that the course is written
        self.cur.execute(
            'SELECT * FROM course WHERE course.course_id = %s',
            self.NEW_COURSE_ID
        )
        new_course_result = self.cur.fetchall()
        expected_course_res = {
            'course_id': self.NEW_COURSE_ID,
            'name': 'test_new_course_name',
            'call_number': 'new_course_code',
            'department_id': self.LAW_DEPARTMENT_ID,
            'status': 'pending'
        }

        self.assertDictEqual(new_course_result[0], expected_course_res)

        # verify that the professor department relationship is written
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
        self.assertDictEqual(professor_department_relationship[0],
                             expected_professor_department_res)

    def test_insert_new_professor_existing_course(self):
        new_professor_input = {
            'first_name': 'test_first_name',
            'last_name': 'test_last_name',
            'uni': 'test123',
            'department': self.COMPUTER_SCIENCE_DEPARTMENT_ID
        }
        add_course_professor(new_professor_input,
                             self.MACHINE_LEARNING_COURSE_ID)
        db.commit()

        self.cur.execute(
            ('SELECT * FROM course_professor WHERE '
                'course_professor.course_id = %s AND '
                'course_professor.professor_id = %s'),
            [self.MACHINE_LEARNING_COURSE_ID, self.NEW_PROFESSOR_ID]
        )
        course_professor_result = self.cur.fetchone()
        expected_course_professor_result = {
            'course_professor_id': self.NEW_COURSE_PROFESSOR_ID,
            'course_id': self.MACHINE_LEARNING_COURSE_ID,
            'professor_id': self.NEW_PROFESSOR_ID,
            'status': 'pending'
        }
        self.assertDictEqual(expected_course_professor_result,
                             course_professor_result)

        self.cur.execute(
            'SELECT * FROM professor WHERE professor.professor_id = %s',
            self.NEW_PROFESSOR_ID
        )

        new_professor_result = self.cur.fetchall()

        expected_professor_res = {
            'professor_id': self.NEW_PROFESSOR_ID,
            'first_name': 'test_first_name',
            'last_name': 'test_last_name',
            'uni': 'test123',
            'status': 'pending'
        }

        self.assertDictEqual(new_professor_result[0], expected_professor_res)

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
        self.assertDictEqual(professor_department_relationship[0],
                             expected_professor_department_res)

    def test_insert_existing_professor_existing_course(self):
        add_course_professor(self.BOLLINGER_PROFESSOR_ID,
                             self.MACHINE_LEARNING_COURSE_ID)
        db.commit()

        self.cur.execute(
            ('SELECT * FROM course_professor WHERE '
                'course_professor.course_id = %s AND '
                'course_professor.professor_id = %s'),
            [self.MACHINE_LEARNING_COURSE_ID, self.BOLLINGER_PROFESSOR_ID]
        )
        course_professor_result = self.cur.fetchone()
        expected_course_professor_result = {
            'course_professor_id': self.NEW_COURSE_PROFESSOR_ID,
            'course_id': self.MACHINE_LEARNING_COURSE_ID,
            'professor_id': self.BOLLINGER_PROFESSOR_ID,
            'status': 'pending'
        }
        self.assertDictEqual(expected_course_professor_result,
                             course_professor_result)

    def test_insert_existing_professor_new_course(self):
        new_course_input = {
            'name': 'test_new_course_name',
            'department': self.LAW_DEPARTMENT_ID,
            'code': 'new_course_code',
            'status': 'pending'
        }
        add_course_professor(self.VERMA_PROFESSOR_ID, new_course_input)
        db.commit()

        self.cur.execute(
            ('SELECT * FROM course_professor WHERE '
                'course_professor.course_id = %s AND '
                'course_professor.professor_id = %s'),
            [self.NEW_COURSE_ID, self.VERMA_PROFESSOR_ID]
        )
        course_professor_result = self.cur.fetchone()
        expected_course_professor_result = {
            'course_professor_id': self.NEW_COURSE_PROFESSOR_ID,
            'course_id': self.NEW_COURSE_ID,
            'professor_id': self.VERMA_PROFESSOR_ID,
            'status': 'pending'
        }
        self.assertDictEqual(expected_course_professor_result,
                             course_professor_result)

        self.cur.execute(
            'SELECT * FROM course WHERE course.course_id = %s',
            self.NEW_COURSE_ID
        )
        new_course_result = self.cur.fetchall()
        expected_course_res = {
            'course_id': self.NEW_COURSE_ID,
            'name': 'test_new_course_name',
            'call_number': 'new_course_code',
            'status': 'pending',
            'department_id': self.LAW_DEPARTMENT_ID
        }
        self.assertDictEqual(new_course_result[0], expected_course_res)

    def test_inserts_ignored_if_course_professor_is_approved(self):
        course_professor_id = add_course_professor(
            self.VERMA_PROFESSOR_ID,
            self.MACHINE_LEARNING_COURSE_ID)
        db.commit()

        self.assertEqual(self.VERMA_MACHINE_LEARNING_ID,
                         course_professor_id)

        self.cur.execute(
            ('SELECT * FROM course_professor WHERE '
                'course_professor.course_id = %s AND '
                'course_professor.professor_id = %s'),
            [self.MACHINE_LEARNING_COURSE_ID, self.VERMA_PROFESSOR_ID]
        )
        course_professor_result = self.cur.fetchall()
        expected_course_professor_result = {
            'course_professor_id': self.VERMA_MACHINE_LEARNING_ID,
            'course_id': self.MACHINE_LEARNING_COURSE_ID,
            'professor_id': self.VERMA_PROFESSOR_ID,
            'status': 'approved'
        }
        self.assertEqual(len(course_professor_result), 1)
        self.assertDictEqual(expected_course_professor_result,
                             course_professor_result[0])

    def test_inserts_ignored_if_course_professor_is_pending(self):
        course_professor_id = add_course_professor(
            self.VERMA_PROFESSOR_ID,
            self.FREEDOM_OF_SPEECH_COURSE_ID)
        db.commit()

        self.assertEqual(self.VERMA_FREEDOM_OF_SPEECH_ID,
                         course_professor_id)

        self.cur.execute(
            ('SELECT * FROM course_professor WHERE '
                'course_professor.course_id = %s AND '
                'course_professor.professor_id = %s'),
            [self.FREEDOM_OF_SPEECH_COURSE_ID, self.VERMA_PROFESSOR_ID]
        )
        course_professor_result = self.cur.fetchall()
        expected_course_professor_result = {
            'course_professor_id': self.VERMA_FREEDOM_OF_SPEECH_ID,
            'course_id': self.FREEDOM_OF_SPEECH_COURSE_ID,
            'professor_id': self.VERMA_PROFESSOR_ID,
            'status': 'pending'
        }
        self.assertEqual(1, len(course_professor_result))
        self.assertDictEqual(expected_course_professor_result,
                             course_professor_result[0])

    def test_inserts_if_course_professor_is_rejected(self):
        add_course_professor(self.VERMA_PROFESSOR_ID,
                             self.INT_MACHINE_LEARNING_COURSE_ID)
        db.commit()

        self.cur.execute(
            ('SELECT * FROM course_professor WHERE '
                'course_professor.course_id = %s AND '
                'course_professor.professor_id = %s'),
            [self.INT_MACHINE_LEARNING_COURSE_ID, self.VERMA_PROFESSOR_ID]
        )
        course_professor_result = self.cur.fetchall()
        expected_course_professor_result = {
            'course_professor_id': self.VERMA_INT_MACHINE_LEARNING_ID,
            'course_id': self.INT_MACHINE_LEARNING_COURSE_ID,
            'professor_id': self.VERMA_PROFESSOR_ID,
            'status': 'pending'
        }
        self.assertEqual(1, len(course_professor_result))
        self.assertDictEqual(expected_course_professor_result,
                             course_professor_result[0])

    def test_inserts_ignored_if_uni_duplicate(self):
        new_professor_input = {
            'first_name': 'duplicate_first_name',
            'last_name': 'duplicate_last_name',
            'uni': self.VERMA_UNI,
            'department': self.COMPUTER_SCIENCE_DEPARTMENT_ID
        }

        new_course_input = {
            'name': 'test_new_course_name',
            'department': self.LAW_DEPARTMENT_ID,
            'code': 'new_course_code'
        }

        course_professor_id = add_course_professor(new_professor_input,
                                                   new_course_input)
        self.assertEqual(self.NEW_COURSE_PROFESSOR_ID, course_professor_id)

        self.cur.execute(
            ('SELECT * FROM course_professor WHERE '
                'course_professor.course_id = %s AND '
                'course_professor.professor_id = %s'),
            [self.NEW_COURSE_ID, self.VERMA_PROFESSOR_ID]
        )

        course_professor_result = self.cur.fetchall()
        expected_course_professor_result = {
            'course_professor_id': self.NEW_COURSE_PROFESSOR_ID,
            'course_id': self.NEW_COURSE_ID,
            'professor_id': self.VERMA_PROFESSOR_ID,
            'status': 'pending'
        }
        self.assertEqual(1, len(course_professor_result))
        self.assertDictEqual(expected_course_professor_result,
                             course_professor_result[0])
