from api.data.dataloaders.courses_loader import get_cp_id_by_course, \
    get_course_by_id, get_course, get_department_professors
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
        course_id = 1
        expected_res = [{'course_id': course_id,
                         'name': 'Machine Learning',
                         'department_id': 1,
                         'call_number': 'COMS 4771',
                         'department_name': 'Computer Science',
                         }]

        res = get_course(course_id)

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
        course_id = 1
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
        res = get_department_professors(course_id)

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
