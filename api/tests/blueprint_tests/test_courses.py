from unittest import mock
from api.tests import BaseTest


class CoursesTest(BaseTest):

    @mock.patch('api.blueprints.courses.get_department_professors')
    @mock.patch('api.blueprints.courses.get_course')
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

        res = self.app.get(f'/api/course/{course_id}')
        self.assertDictEqual(expected_res, res.json)
