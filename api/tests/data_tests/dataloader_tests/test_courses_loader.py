from api.data import db
from api.data.dataloaders.courses_loader import get_cp_id_by_course, \
    get_course_by_id
from api.tests import LoadersWritersBaseTest
from api.tests.data_tests.common import setup_department_professor_courses


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
        cur = db.get_cursor()
        setup_department_professor_courses(cur)
        for test_case in test_cases:
            with self.subTest(test_case):
                res = get_cp_id_by_course(
                    test_case['course_id'],
                    test_case['prof_ids']
                )
                self.assertEqual(res, test_case['expected_res'])

    def test_get_course_by_id(self):
        cur = db.get_cursor()
        setup_department_professor_courses(cur)
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
