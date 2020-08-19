from unittest import mock
from api.tests import BaseTest


TEST_PROFESSOR_ID = 1


class ProfessorsTest(BaseTest):
    @mock.patch('api.blueprints.professor.get_professor_courses')
    @mock.patch('api.blueprints.professor.get_professor_name')
    def test_retrieve_professor_summary(
            self, mock_professor_name, mock_professor_courses):
        mock_professor_name.return_value = [{
            'first_name': 'Nakul',
            'last_name': 'Verma',
        }]
        mock_professor_courses.return_value = [{
            'course_professor_id': 1,
            'name': 'Machine Learning',
            'call_number': 'COMS 4771'
        }, {
            'course_professor_id': 2,
            'name': 'Advanced Machine Learning',
            'call_number': 'COMS 4774'
        }]
        expected_res = {
            'firstName': 'Nakul',
            'lastName': 'Verma',
            'courses': [
                {
                    'courseProfessorId': 1,
                    'courseName': 'Machine Learning',
                    'courseCallNumber': 'COMS 4771'
                }, {
                    'courseProfessorId': 2,
                    'courseName': 'Advanced Machine Learning',
                    'courseCallNumber': 'COMS 4774'
                }
            ]
        }

        res = self.client.get(f'/api/professor/{TEST_PROFESSOR_ID}')
        self.assertEqual(expected_res, res.json)

    @mock.patch('api.blueprints.professor.get_professor_courses')
    @mock.patch('api.blueprints.professor.get_professor_name')
    def test_retrieve_professor_summary_no_courses(
            self, mock_professor_name, mock_professor_courses):
        mock_professor_name.return_value = [{
            'first_name': 'Nakul',
            'last_name': 'Verma',
        }]
        mock_professor_courses.return_value = []
        expected_res = {
            'firstName': 'Nakul',
            'lastName': 'Verma',
            'courses': []
        }

        res = self.client.get(f'/api/professor/{TEST_PROFESSOR_ID}')
        self.assertEqual(expected_res, res.json)

    @mock.patch('api.blueprints.professor.get_professor_courses')
    @mock.patch('api.blueprints.professor.get_professor_name')
    def test_retrieve_professor_summary_empty(
            self, mock_professor_name, mock_professor_courses):
        mock_professor_name.return_value = []
        mock_professor_courses.return_value = []
        expected_error = {'error': 'Missing professor name'}

        res = self.client.get(f'/api/professor/{TEST_PROFESSOR_ID}')
        self.assertEqual(res.status_code, 400)
        self.assertEqual(expected_error, res.json)

    @mock.patch('api.blueprints.professor.get_professor_courses')
    def test_retrieve_professor_courses(self, mock_professor_courses):
        mock_professor_courses.return_value = [{
            'course_professor_id': 1,
            'name': 'Machine Learning',
            'call_number': 'COMS 4771'
        }, {
            'course_professor_id': 2,
            'name': 'Advanced Machine Learning',
            'call_number': 'COMS 4774'
        }]
        expected_res = {
            'courses': [
                {
                    'text': 'Machine Learning',
                    'value': 1,
                    'key': 'Machine Learning'
                }, {
                    'text': 'Advanced Machine Learning',
                    'value': 2,
                    'key': 'Advanced Machine Learning'
                }
            ]
        }

        res = self.client.get(f'/api/professor/{TEST_PROFESSOR_ID}/courses')
        self.assertEqual(expected_res, res.json)

    @mock.patch('api.blueprints.professor.get_professor_courses')
    def test_retrieve_professor_courses_empty(self, mock_professor_courses):
        mock_professor_courses.return_value = []
        expected_res = {
            'courses': []
        }

        res = self.client.get(f'/api/professor/{TEST_PROFESSOR_ID}/courses')
        self.assertEqual(expected_res, res.json)
