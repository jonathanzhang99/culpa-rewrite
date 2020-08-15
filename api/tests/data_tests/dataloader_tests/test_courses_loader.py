from api.data import db
from api.data.dataloaders.courses_loader import get_course, \
    get_department_professors, search_course, get_cp_id_by_course, \
    get_course_by_id
from api.tests import LoadersWritersBaseTest
from api.tests.data_tests.common import setup_department_professor_courses


MACHINE_LEARNING_COURSE_ID = 1
ADV_MACHINE_LEARNING_COURSE_ID = 2
OPERATING_SYSTEMS_COURSE_ID = 3
ADVANCED_PROGRAMMING_COURSE_ID = 4
FREEDOM_OF_SPEECH_COURSE_ID = 5
MATHEMATICS_OF_ML_COURSE_ID = 6


class CoursesLoaderTest(LoadersWritersBaseTest):
    def test_get_cp_id_by_course(self):
        test_cases = [
            {
                'course_id': 4,
                'prof_ids': [],
                'expected_res': [
                    {
                        'course_professor_id': 4,
                        'professor_id': 1
                    },
                    {
                        'course_professor_id': 5,
                        'professor_id': 3
                    },
                ]
            },
            {
                'course_id': 3,
                'prof_ids': [3, 5],
                'expected_res': [
                    {
                        'course_professor_id': 6,
                        'professor_id': 3
                    },
                ]
            },
            {
                'course_id': 1,
                'prof_ids': [9],
                'expected_res': ()
            },
            {
                'course_id': 12345,
                'prof_ids': [],
                'expected_res': ()
            },
        ]
        setup_department_professor_courses(self.cur)
        for test_case in test_cases:
            with self.subTest(test_case):
                res = get_cp_id_by_course(
                    test_case['course_id'],
                    test_case['prof_ids']
                )
                self.assertEqual(res, test_case['expected_res'])

    def test_get_course_by_id(self):
        setup_department_professor_courses(self.cur)
        test_cases = [
            {
                'id': 1,
                'expected_res': {
                    'course_id': 1,
                    'name': 'Machine Learning',
                    'call_number': 'COMS 4771'
                }
            },
            {
                'id': 4,
                'expected_res': {
                    'course_id': 4,
                    'name': 'Advanced Programming',
                    'call_number': 'COMS 3157'
                }
            },
            {
                'id': 12345,
                'expected_res': None
            }
        ]

        for test_case in test_cases:
            with self.subTest(test_case):
                res = get_course_by_id(test_case['id'])
                self.assertEqual(res, test_case['expected_res'])

    def test_get_course(self):
        setup_department_professor_courses(self.cur)
        expected_res = [{'course_id': MACHINE_LEARNING_COURSE_ID,
                         'name': 'Machine Learning',
                         'department_id': 1,
                         'call_number': 'COMS 4771',
                         'department_name': 'Computer Science',
                         }]

        res = get_course(MACHINE_LEARNING_COURSE_ID)

        self.assertEqual(expected_res, res)

    def test_get_course_fail(self):
        '''
        Test when get_course couldn't find a matching course in the db
        '''
        setup_department_professor_courses(self.cur)
        course_id = 20

        res = get_course(course_id)

        self.assertEqual((), res)

    def test_get_department_professors(self):
        setup_department_professor_courses(self.cur)
        expected_res = [{'professor_id': 1,
                         'first_name': 'Nakul',
                         'last_name': 'Verma',
                         'department_id': 1,
                         'name': 'Computer Science'},
                        {'professor_id': 1,
                         'first_name': 'Nakul',
                         'last_name': 'Verma',
                         'department_id': 3,
                         'name': 'Mathematics'}]
        res = get_department_professors(MACHINE_LEARNING_COURSE_ID)

        for i in range(len(res)):
            self.assertDictEqual(expected_res[i], res[i])

    def test_get_department_professors_fail(self):
        '''
        Test when no matching course is found
        '''
        setup_department_professor_courses(self.cur)
        course_id = 20

        res = get_department_professors(course_id)

        self.assertEqual((), res)

    def test_search_course_by_name(self):
        setup_department_professor_courses(self.cur)
        db.commit()

        results = search_course('Freedom of Speech and Press')
        self.assertEqual(len(results), 1)

        # assert the data formatting is correct
        self.assertEqual(
            set(results[0].keys()),
            set([
                'course_id',
                'name',
                'call_number',
                'score',
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

    def test_search_multiple_courses_by_name(self):
        setup_department_professor_courses(self.cur)
        db.commit()

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

    def test_search_course_by_call_number(self):
        setup_department_professor_courses(self.cur)
        db.commit()

        results = search_course('4118')

        self.assertEqual(len(results), 1)
        self.assertGreater(results[0].get('score'), 0.2)
        self.assertEqual(
            results[0].get('course_id'), OPERATING_SYSTEMS_COURSE_ID
        )

    def test_search_course_with_limit(self):
        setup_department_professor_courses(self.cur)
        db.commit()

        results = search_course('Machine Learning', limit=1)

        self.assertEqual(len(results), 1)
        self.assertGreater(results[0].get('score'), 0)
        self.assertEqual(
            results[0].get('course_id'), MACHINE_LEARNING_COURSE_ID
        )

    def test_search_course_no_results(self):
        setup_department_professor_courses(self.cur)
        db.commit()

        results = search_course('intro to photo', limit=1)

        self.assertEqual(len(results), 0)
