from unittest import mock
from api.tests import BaseTest


class DepartmentsTest(BaseTest):
    CS_DEPARTMENT_ID = 1

    @mock.patch('api.blueprints.department.load_all_departments')
    def test_get_all_departments(self, mock_departments):
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
                    'departmentId': 1,
                    'departmentName': 'Computer Science'
                }, {
                    'departmentId': 2,
                    'departmentName': 'English'
                }
            ]
        }

        res = self.client.get('/api/department/all')
        self.assertEqual(expected_res, res.json)

    @mock.patch('api.blueprints.department.load_all_departments')
    def test_get_all_departments_empty(self, mock_departments):
        mock_departments.return_value = []
        expected_res = {
            'departments': []
        }

        res = self.client.get('/api/department/all')
        self.assertEqual(expected_res, res.json)

    @mock.patch('api.blueprints.department.load_all_departments')
    def test_retrieve_all_departments_in_option_format(self, mock_departments):
        mock_departments.return_value = [{
            'key': 1,
            'department_id': 1,
            'name': 'Computer Science'
        }, {
            'key': 2,
            'department_id': 2,
            'name': 'English'
        }]

        expected_res = {
            'departments': [
                {
                    'key': 1,
                    'value': 1,
                    'text': 'Computer Science'
                }, {
                    'key': 2,
                    'value': 2,
                    'text': 'English'
                }
            ]
        }

        res = self.client.get('/api/department/all?option=1')
        self.assertEqual(expected_res, res.json)

    @mock.patch('api.blueprints.department.load_department_professors')
    @mock.patch('api.blueprints.department.load_department_courses')
    @mock.patch('api.blueprints.department.load_department_name')
    def test_get_department_info(
            self, mock_name, mock_courses, mock_professors):
        mock_name.return_value = [{
            'name': 'Computer Science'
        }]
        mock_courses.return_value = [{
            'course_id': 2,
            'name': 'Machine Learning'
        }, {
            'course_id': 1,
            'name': 'User Interface Design',
        }]
        mock_professors.return_value = [{
            'professor_id': 1,
            'first_name': 'Lydia',
            'last_name': 'Chilton',
            'badge_id': None,
        }, {
            'professor_id': 2,
            'first_name': 'Nakul',
            'last_name': 'Verma',
            'badge_id': 1,
        }]
        expected_res = {
            'departmentName': 'Computer Science',
            'departmentCourses': [
                {
                    'courseId': 2,
                    'courseName': 'Machine Learning'
                },
                {
                    'courseId': 1,
                    'courseName': 'User Interface Design'
                }
            ],
            'departmentProfessors': [
                {
                    'professorId': 1,
                    'firstName': 'Lydia',
                    'lastName': 'Chilton',
                    'badges': [],
                }, {
                    'professorId': 2,
                    'firstName': 'Nakul',
                    'lastName': 'Verma',
                    'badges': [1]
                }
            ]
        }

        res = self.client.get(
            f'/api/department/{self.CS_DEPARTMENT_ID}')
        self.assertEqual(expected_res, res.json)

    @mock.patch('api.blueprints.department.load_department_name')
    def test_get_department_info_empty(self, mock_name):
        mock_name.return_value = []
        expected_error = {'error': 'Missing department name'}

        res = self.client.get(
            f'/api/department/{self.CS_DEPARTMENT_ID}')
        self.assertEqual(res.status_code, 400)
        self.assertEqual(expected_error, res.json)
