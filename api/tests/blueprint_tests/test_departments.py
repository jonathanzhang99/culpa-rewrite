from unittest import mock
from api.tests import BaseTest


class DepartmentsTest(BaseTest):
    @mock.patch('api.blueprints.departments.get_all_departments')
    def test_retrieve_all_departments(self, mock_departments):
        mock_departments.return_value = [{
            'departments_id': 1,
            'name': 'Computer Science',
        }, {
            'departments_id': 2,
            'name': 'English',
        }]
        expected_res = {
            'departments': [
                {
                    'name': 'Computer Science'
                }, {
                    'name': 'English'
                }
            ]
        }

        res = self.app.post('/api/departments/all')
        self.assertEqual(expected_res, res.json)

    @mock.patch('api.blueprints.departments.get_all_departments')
    def test_retrieve_all_departments_empty(self, mock_departments):
        mock_departments.return_value = []
        expected_res = {
            'departments': []
        }

        res = self.app.post('/api/departments/all')
        self.assertEqual(expected_res, res.json)
