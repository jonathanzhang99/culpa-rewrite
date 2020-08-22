from unittest import mock
from pymysql.err import IntegrityError
from api.tests import BaseTest


ML_COURSE_ID = 1
BAD_COURSE_ID = -1


class CoursesTest(BaseTest):
    @mock.patch('api.blueprints.course.load_course_professors')
    @mock.patch('api.blueprints.course.load_course_basic_info')
    def test_get_course_summary(
            self, mock_load_course_basic_info, mock_load_course_professors):
        mock_load_course_basic_info.return_value = [{
            'course_id': ML_COURSE_ID,
            'name': 'Machine Learning',
            'department_id': 1,
            'call_number': 'COMS 4771',
            'department_name': 'Computer Science',
        }]
        mock_load_course_professors.return_value = [{
            'professor_id': 1,
            'first_name': 'Nakul',
            'last_name': 'Verma',
            'name': 'Computer Science',
            'department_id': 1,
        }, {
            'professor_id': 1,
            'first_name': 'Nakul',
            'last_name': 'Verma',
            'name': 'Mathematics',
            'department_id': 3,
        }]
        expected_res = {
            'courseName': 'Machine Learning',
            'courseCallNumber': 'COMS 4771',
            'departmentId': 1,
            'departmentName': 'Computer Science',
            'courseProfessors': [{
                'firstName': 'Nakul',
                'lastName': 'Verma',
                'professorId': 1,
                'professorDepartments': [{
                    'professorDepartmentId': 1,
                    'professorDepartmentName': 'Computer Science'
                }, {
                    'professorDepartmentId': 3,
                    'professorDepartmentName': 'Mathematics'
                }]
            }]
        }

        res = self.client.get(f'/api/course/{ML_COURSE_ID}')
        self.assertEqual(expected_res, res.json)

    @mock.patch('api.blueprints.course.load_course_professors')
    @mock.patch('api.blueprints.course.load_course_basic_info')
    def test_get_course_summary_no_professors(
            self, mock_load_course_basic_info, mock_load_course_professors):
        mock_load_course_basic_info.return_value = [{
            'course_id': ML_COURSE_ID,
            'name': 'Machine Learning',
            'department_id': 1,
            'call_number': 'COMS 4771',
            'department_name': 'Computer Science',
        }]
        mock_load_course_professors.return_value = []
        expected_res = {
            'courseName': 'Machine Learning',
            'courseCallNumber': 'COMS 4771',
            'departmentId': 1,
            'departmentName': 'Computer Science',
            'courseProfessors': []
        }

        res = self.client.get(f'/api/course/{ML_COURSE_ID}')
        self.assertEqual(expected_res, res.json)

    @mock.patch('api.blueprints.course.load_course_professors')
    @mock.patch('api.blueprints.course.load_course_basic_info')
    def test_get_course_summary_empty(
            self, mock_load_course_basic_info, mock_load_course_professors):
        mock_load_course_basic_info.return_value = []
        mock_load_course_professors.return_value = []
        expected_res = {'error': 'Missing course basic info'}

        res = self.client.get(f'/api/course/{BAD_COURSE_ID}')
        self.assertEqual(expected_res, res.json)

    @mock.patch('api.blueprints.course.load_course_professors')
    @mock.patch('api.blueprints.course.load_course_basic_info')
    def test_get_course_summary_db_failure(
            self, mock_load_course_basic_info, mock_load_course_professors):
        mock_load_course_basic_info.side_effect = IntegrityError()
        expected_res = {'error': 'Invalid data'}

        res = self.client.get(f'/api/course/{ML_COURSE_ID}')
        self.assertEqual(expected_res, res.json)
