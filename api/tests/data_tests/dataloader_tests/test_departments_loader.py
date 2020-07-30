from api.data import db
from api.data.dataloaders.departments_loader import get_all_departments
from api.data.dataloaders.departments_loader import get_department_courses
from api.data.dataloaders.departments_loader import get_department_professors
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

    def test_load_professors(self):
        TEST_DEPARTMENT_ID = 1

        cur = db.get_cursor()
        cur.execute(
            'INSERT INTO department (name)'
            'VALUES ("test1")'
        )
        cur.execute(
            'INSERT INTO professor (first_name, last_name)'
            'VALUES ("test1first", "test1last")'
        )
        cur.execute(
            'INSERT INTO professor (first_name, last_name)'
            'VALUES ("test2first", "test2last")'
        )
        cur.execute(
            'INSERT INTO department_professor (professor_id, department_id)'
            f'VALUES (1, {TEST_DEPARTMENT_ID})'
        )
        expected_res = [{'professor_id': 1,
                         'first_name': 'test1first',
                         'last_name': 'test1last'
                         }]

        res = get_department_professors(TEST_DEPARTMENT_ID)

        self.assertEqual(expected_res, res)
