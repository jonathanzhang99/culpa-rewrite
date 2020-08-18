from unittest import mock

from pymysql.err import IntegrityError

from api.tests import BaseTest


class CoursesTest(BaseTest):

    @mock.patch('api.blueprints.course.get_department_professors')
    @mock.patch('api.blueprints.course.get_course')
    def test_course_summary(self, mock_get_course,
                            mock_get_department_professors):
        course_id = 1

        mock_get_course.return_value = [{
            'course_id': course_id,
            'name': 'Machine Learning',
            'department_id': 1,
            'call_number': 'COMS4771',
            'department_name': 'Computer Science',
        }]

        mock_get_department_professors.return_value = [{
            'professor_id': 2,
            'first_name': 'Nakul',
            'last_name': 'Verma',
            'name': 'Computer Science',
            'department_id': 1,
        },
            {
            'professor_id': 2,
            'first_name': 'Nakul',
            'last_name': 'Verma',
            'name': 'Law',
            'department_id': 2,
        }]

        expected_res = {'courseSummary': {
            'courseName': 'Machine Learning',
            'courseCallNumber': 'COMS4771',
            'departmentId': 1,
            'departmentName': 'Computer Science',
            'associatedProfessors': [{
                'firstName': 'Nakul',
                'lastName': 'Verma',
                'professorId': 2,
                'profDepartments': [{
                    'profDepartmentId': 1,
                    'profDepartmentName': 'Computer Science',
                },
                    {
                    'profDepartmentId': 2,
                    'profDepartmentName': 'Law',
                }]
            }]
        }}

        res = self.client.get(f'/api/course/{course_id}')
        self.assertDictEqual(expected_res, res.json)

    @mock.patch('api.blueprints.course.get_department_professors')
    @mock.patch('api.blueprints.course.get_course')
    def test_course_summary_no_course(self, mock_get_course,
                                      mock_get_department_professors):
        course_id = 20

        mock_get_course.return_value = []

        mock_get_department_professors.return_value = []

        expected_res = {'error': 'course not found'}
        res = self.client.get(f'/api/course/{course_id}')

        self.assertDictEqual(expected_res, res.json)

    @mock.patch('api.blueprints.course.get_department_professors')
    @mock.patch('api.blueprints.course.get_course')
    def test_course_summary_no_professors(self, mock_get_course,
                                          mock_get_department_professors):
        course_id = 1

        mock_get_course.return_value = [{
            'course_id': course_id,
            'name': 'Machine Learning',
            'department_id': 1,
            'call_number': 'COMS4771',
            'department_name': 'Computer Science',
        }]

        mock_get_department_professors.return_value = []

        expected_res = {'courseSummary': {
            'courseName': 'Machine Learning',
            'courseCallNumber': 'COMS4771',
            'departmentId': 1,
            'departmentName': 'Computer Science',
            'associatedProfessors': []}
        }

        res = self.client.get(f'/api/course/{course_id}')

        self.assertDictEqual(expected_res, res.json)

    @mock.patch('api.blueprints.course.get_department_professors')
    @mock.patch('api.blueprints.course.get_course')
    def test_course_summary_db_failure(self, mock_get_course,
                                       mock_get_department_professors):
        course_id = 1

        mock_get_course.side_effect = IntegrityError()

        expected_res = {'error': 'Invalid data'}
        res = self.client.get(f'/api/course/{course_id}')

        self.assertEqual(expected_res, res.json)
