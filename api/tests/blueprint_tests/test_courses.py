from unittest import mock
from api.tests import BaseTest


class CoursesTest(BaseTest):

    @mock.patch('api.blueprints.courses.loader')
    def test_course_summary(self, mock_loader):
        course_id = 1

        mock_loader.get_course.return_value = [{
            'course_id': course_id,
            'name': 'Machine Learning',
            'department_id': 1,
            'call_number': 'COMS4771',
        }]

        mock_loader.get_department.return_value = [{
            'name': 'Computer Science'
        }]

        mock_loader.get_prof_by_course.return_value = [{
            'professor_id': 2,
            'first_name': 'Nakul',
            'last_name': 'Verma',
        }]

        mock_loader.get_department_by_prof.return_value = [{
            'professor_id': 2,
            'department_id': 1,
            'name': 'Computer Science',
        },
            {
            'professor_id': 2,
            'department_id': 2,
            'name': 'Law',
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
