from unittest import mock
from api.tests import BaseTest


class DepartmentsTest(BaseTest):
    @mock.patch('api.blueprints.departments.get_all_departments')
    def test_retrieve_all_departments(self, mock_departments):
        mock_departments.return_value = [{
            'department_id': 1,
            'name': 'Computer Science'
        }, {
            'department_id': 2,
            'name': 'English'
        }]
        expected_res = {
            'departments': [
                {
                    'id': 1,
                    'name': 'Computer Science'
                }, {
                    'id': 2,
                    'name': 'English'
                }
            ]
        }

        res = self.app.get('/api/departments/all')
        self.assertEqual(expected_res, res.json)

    @mock.patch('api.blueprints.departments.get_all_departments')
    def test_retrieve_all_departments_empty(self, mock_departments):
        mock_departments.return_value = []
        expected_res = {
            'departments': []
        }

        res = self.app.get('/api/departments/all')
        self.assertEqual(expected_res, res.json)

    @mock.patch('api.blueprints.departments.get_department_professors')
    @mock.patch('api.blueprints.departments.get_department_courses')
    def test_retrieve_department_info(self, mock_courses, mock_professors):
        TEST_DEPARTMENT_ID = 1

        mock_courses.return_value = [{
            'course_id': 1,
            'name': 'User Interface Design',
        }, {
            'course_id': 2,
            'name': 'Machine Learning'
        }]
        mock_professors.return_value = [{
            'professor_id': 1,
            'first_name': 'Lydia',
            'last_name': 'Chilton'
        }, {
            'professor_id': 2,
            'first_name': 'Nakul',
            'last_name': 'Verma'
        }]
        expected_res = {
            'courses': [
                {
                    'name': 'User Interface Design'
                }, {
                    'name': 'Machine Learning'
                }
            ],
            'professors': [
                {
                    'firstName': 'Lydia',
                    'lastName': 'Chilton'
                }, {
                    'firstName': 'Nakul',
                    'lastName': 'Verma'
                }
            ]
        }

        res = self.app.get(
            f'/api/departments/{TEST_DEPARTMENT_ID}')
        self.maxDiff = None
        self.assertEqual(expected_res, res.json)
