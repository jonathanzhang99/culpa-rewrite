from api.data.dataloaders.departments_loader import load_all_departments, \
    load_department_courses, load_department_name, load_department_professors
from api.tests import LoadersWritersBaseTest
from api.tests.data_tests.common import setup_department_professor_courses


CS_DEPARTMENT_ID = 1
BAD_DEPARTMENT_ID = -1


class DepartmentsLoaderTest(LoadersWritersBaseTest):
    # We set up tests in this file so that the mock databases are in a usable
    # state. For edge cases (e.g. empty tables, empty relationships), see
    # tests in data_tests/common.py
    def setUp(self):
        super().setUp()
        setup_department_professor_courses(self.cur)

    def test_load_departments(self):
        expected_departments = [{
            'department_id': 1,
            'name': 'Computer Science'
        }, {
            'department_id': 2,
            'name': 'Law'
        }, {
            'department_id': 3,
            'name': 'Mathematics'
        }]

        departments = load_all_departments()
        self.assertEqual(expected_departments, departments)

    def test_load_name(self):
        expected_name = [{
            'name': 'Computer Science'
        }]

        name = load_department_name(CS_DEPARTMENT_ID)
        self.assertEqual(expected_name, name)

    def test_load_name_empty(self):
        name = load_department_name(BAD_DEPARTMENT_ID)
        self.assertEqual((), name)

    def test_load_courses(self):
        expected_courses = [{
            'course_id': 2,
            'name': 'Advanced Machine Learning'
        }, {
            'course_id': 4,
            'name': 'Advanced Programming'
        }, {
            'course_id': 1,
            'name': 'Machine Learning'
        }, {
            'course_id': 3,
            'name': 'Operating Systems'
        }]

        courses = load_department_courses(CS_DEPARTMENT_ID)
        self.assertEqual(expected_courses, courses)

    def test_load_courses_empty(self):
        courses = load_department_courses(BAD_DEPARTMENT_ID)
        self.assertEqual((), courses)

    def test_load_professors(self):
        expected_professors = [
            {
                'professor_id': 3,
                'first_name': 'Jae W',
                'last_name': 'Lee',
                'badges': '[null]',
            },
            {
                'professor_id': 1,
                'first_name': 'Nakul',
                'last_name': 'Verma',
                'badges': '[1, 2]',
            },
            {
                'professor_id': 4,
                'first_name': 'Nakul',
                'last_name': 'Burma',
                'badges': '[3]',
            }
        ]

        professors = load_department_professors(CS_DEPARTMENT_ID)
        self.assertEqual(expected_professors, professors)

    def test_load_professors_empty(self):
        professors = load_department_professors(BAD_DEPARTMENT_ID)
        self.assertEqual((), professors)
