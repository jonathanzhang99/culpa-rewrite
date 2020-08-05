from api.data import db
from api.data.dataloaders.departments_loader import get_all_departments, \
    get_department_courses, get_department_name, get_department_professors
from api.tests import LoadersBaseTest


class DepartmentsLoaderTest(LoadersBaseTest):
    def test_load_departments(self):
        cur = db.get_cursor()
        cur.execute(
            'INSERT INTO department (name)'
            'VALUES ("test1")'
        )
        expected_res = [{'department_id': 1,
                         'name': 'test1'
                         }]

        res = get_all_departments()

        self.assertEqual(expected_res, res)

    def test_load_name(self):
        TEST_DEPARTMENT_ID = 1

        cur = db.get_cursor()
        cur.execute(
            'INSERT INTO department (name)'
            'VALUES ("test1")'
        )
        expected_res = [{'name': 'test1'}]

        res = get_department_name(TEST_DEPARTMENT_ID)

        self.assertEqual(expected_res, res)

    def test_load_courses(self):
        TEST_DEPARTMENT_ID = 1

        cur = db.get_cursor()
        cur.execute(
            'INSERT INTO department (name)'
            'VALUES ("test1")'
        )
        cur.execute(
            'INSERT INTO course (name, department_id)'
            f'VALUES ("test1", {TEST_DEPARTMENT_ID})'
        )
        expected_res = [{'course_id': 1,
                         'name': 'test1'
                         }]

        res = get_department_courses(TEST_DEPARTMENT_ID)

        self.assertEqual(expected_res, res)

    def test_load_courses_empty(self):
        TEST_DEPARTMENT_ID = 1

        cur = db.get_cursor()
        cur.execute(
            'INSERT INTO department (name)'
            'VALUES ("test1")'
        )

        res = get_department_courses(TEST_DEPARTMENT_ID)

        self.assertFalse(res)

    def test_load_professors(self):
        TEST_DEPARTMENT_ID = 1

        cur = db.get_cursor()
        cur.execute(
            'INSERT INTO department (name)'
            'VALUES ("test1")'
        )
        professors = [
            ('test1first', 'test1last'),
            ('test2first', 'test2last'),
            ('test3first', 'test3last')
        ]
        cur.executemany(
            'INSERT INTO professor (first_name, last_name)'
            'VALUES (%s, %s)',
            professors
        )
        cur.execute(
            'INSERT INTO department_professor (professor_id, department_id)'
            f'VALUES (1, {TEST_DEPARTMENT_ID})'
        )
        cur.execute(
            'INSERT INTO department_professor (professor_id, department_id)'
            f'VALUES (2, {TEST_DEPARTMENT_ID})'
        )
        expected_res = [
            {
                'professor_id': 1,
                'first_name': 'test1first',
                'last_name': 'test1last'
            },
            {
                'professor_id': 2,
                'first_name': 'test2first',
                'last_name': 'test2last'
            }
        ]

        res = get_department_professors(TEST_DEPARTMENT_ID)

        self.assertEqual(expected_res, res)

    def test_load_professors_empty(self):
        TEST_DEPARTMENT_ID = 1

        cur = db.get_cursor()
        cur.execute(
            'INSERT INTO department (name)'
            'VALUES ("test1")'
        )

        res = get_department_professors(TEST_DEPARTMENT_ID)

        self.assertFalse(res)
