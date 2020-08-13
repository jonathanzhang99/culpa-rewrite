from api.data.dataloaders.courses_loader import get_course, \
    get_department_professors
from api.tests import LoadersWritersBaseTest
from api.tests.data_tests.common import setup_department_professor_courses


class CoursesLoaderTest(LoadersWritersBaseTest):
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
