from api.data import db
from api.data.dataloaders.departments_loader import get_all_departments
from api.tests import LoadersBaseTest


class DepartmentsLoaderTest(LoadersBaseTest):
    def test_load_departments(self):
        cur = db.get_cursor()
        cur.execute(
            'INSERT INTO department (name)'
            'VALUES ("test1")'
        )
        expected_res = [{'id': 1,
                         'name': 'test1'
                         }]

        res = get_all_departments()

        self.assertEqual(expected_res, res)
