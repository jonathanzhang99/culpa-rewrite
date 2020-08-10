from api.data import db
from api.data.dataloaders.courses_loader import get_course, \
    get_department_professors
from api.tests import LoadersWritersBaseTest
from api.tests.data_tests.common import setup_department_professor_courses


class CoursesLoaderTest(LoadersWritersBaseTest):
    def populate(self):
        cur = db.get_cursor()
        setup_department_professor_courses(cur)

    def test_get_course(self):
        self.populate()
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
        self.populate()
        course_id = 20

        res = get_course(course_id)

        self.assertTrue(len(res) == 0)

    def test_get_department_professors(self):
        # TODO: populate doesn't include populating department_professor
        self.populate()
        course_id = 1
        res = get_department_professors(course_id)
        print(res)
