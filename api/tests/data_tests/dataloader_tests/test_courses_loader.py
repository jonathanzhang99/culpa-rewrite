from api.data import db
from api.data.dataloaders.courses_loader import load_course_basic_info, \
    load_course_professors, search_course, count_pending_courses
from api.tests import LoadersWritersBaseTest
from api.tests.data_tests.common import setup_department_professor_courses


MACHINE_LEARNING_COURSE_ID = 1
ADV_MACHINE_LEARNING_COURSE_ID = 2
OPERATING_SYSTEMS_COURSE_ID = 3
ADVANCED_PROGRAMMING_COURSE_ID = 4
FREEDOM_OF_SPEECH_COURSE_ID = 5
MATHEMATICS_OF_ML_COURSE_ID = 6
BAD_COURSE_ID = -1
COMPUTER_DEPARTMENT_ID = 1
LAW_DEPARTMENT_ID = 2
MATH_DEPARTMENT_ID = 3


class CoursesLoaderTest(LoadersWritersBaseTest):
    # We set up tests in this file so that the mock databases are in a usable
    # state. For edge cases (e.g. empty tables, empty relationships), see
    # tests in data_tests/common.py
    def setUp(self):
        super().setUp()
        setup_department_professor_courses(self.cur)
        db.commit()

    def test_load_course_basic_info(self):
        expected_basic_info = [{
            'course_id': MACHINE_LEARNING_COURSE_ID,
            'name': 'Machine Learning',
            'department_id': 1,
            'call_number': 'COMS 4771',
            'department_name': 'Computer Science'
        }]

        basic_info = load_course_basic_info(MACHINE_LEARNING_COURSE_ID)
        self.assertEqual(expected_basic_info, basic_info)

    def test_load_course_basic_info_empty(self):
        basic_info = load_course_basic_info(BAD_COURSE_ID)
        self.assertEqual((), basic_info)

    def test_load_course_professors(self):
        expected_professors = [{
            'professor_id': 1,
            'first_name': 'Nakul',
            'last_name': 'Verma',
            'department_ids': '[1, 1, 3, 3]',
            'department_names': '["Computer Science", "Computer Science", '
                              + '"Mathematics", "Mathematics"]',
            'badges': '[1, 2, 1, 2]',
        }]

        professors = load_course_professors(MACHINE_LEARNING_COURSE_ID)
        self.assertEqual(expected_professors, professors)

    def test_load_course_professors_empty(self):
        professors = load_course_professors(BAD_COURSE_ID)
        self.assertEqual((), professors)

    def test_search_course_by_name(self):
        results = search_course('Freedom of Speech and Press')
        self.assertEqual(len(results), 1)

        # Assert the data formatting is correct
        self.assertEqual(
            set(results[0].keys()),
            set([
                'course_id',
                'name',
                'call_number',
                'department_id',
                'department_name',
                'score'
            ])
        )

        # The mysql relevancy ranking algorithm (TF-IDF, BM25 varaiant) should
        # all be > 0 but individual values will differ across OS.
        self.assertGreater(results[0].get('score'), 0.1)

        # We only compare `course_id` and not the entire object because
        # score suffers from floating point precision errors which may easily
        # differ between OS/updates.
        self.assertEqual(
            results[0].get('course_id'), FREEDOM_OF_SPEECH_COURSE_ID
        )

        self.assertEqual(
            results[0].get('department_id'), LAW_DEPARTMENT_ID
        )

    def test_search_multiple_courses_by_name(self):
        results = search_course('Machine Learning')
        self.assertEqual(len(results), 3)

        expected_course_ids = [
            MACHINE_LEARNING_COURSE_ID,
            ADV_MACHINE_LEARNING_COURSE_ID,
            MATHEMATICS_OF_ML_COURSE_ID
        ]
        for course, expected_course_id in zip(results, expected_course_ids):
            self.assertGreater(course.get('score'), 0)
            self.assertEqual(course.get('course_id'), expected_course_id)

        self.assertEqual(
            results[0].get('department_id'), COMPUTER_DEPARTMENT_ID
        )
        self.assertEqual(
            results[1].get('department_id'), COMPUTER_DEPARTMENT_ID
        )
        self.assertEqual(
            results[2].get('department_id'), MATH_DEPARTMENT_ID
        )

    def test_search_course_by_call_number(self):
        results = search_course('4118')
        self.assertEqual(len(results), 1)
        self.assertGreater(results[0].get('score'), 0.2)
        self.assertEqual(
            results[0].get('course_id'), OPERATING_SYSTEMS_COURSE_ID
        )
        self.assertEqual(
            results[0].get('department_id'), COMPUTER_DEPARTMENT_ID
        )

    def test_search_course_with_limit(self):
        results = search_course('Machine Learning', limit=1)
        self.assertEqual(len(results), 1)
        self.assertGreater(results[0].get('score'), 0)
        self.assertEqual(
            results[0].get('course_id'), MACHINE_LEARNING_COURSE_ID
        )
        self.assertEqual(
            results[0].get('department_id'), COMPUTER_DEPARTMENT_ID
        )

    def test_search_course_no_results(self):
        results = search_course('bad course name', limit=1)
        self.assertEqual(len(results), 0)

    def test_count_pending_courses(self):
        self.assertEqual(count_pending_courses()['count'], 1)
