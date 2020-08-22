from unittest import mock
from datetime import datetime
from pymysql.err import IntegrityError
from api.tests import BaseTest

ML_COURSE_ID = 1
BAD_COURSE_ID = -1

positive_review = {
    'professor_id': 3,
    'first_name': 'Jae W',
    'last_name': 'Lee',
    'uni': 'jwl3',
    'review_id': 1,
    'content': 'demo content 1',
    'workload': 'demo workload 1',
                'rating': 5,
                'submission_date': datetime.strptime('2019-10-13', '%Y-%m-%d'),
                'agrees': 1,
                'disagrees': 2,
                'funnys': 1,
                'agree_clicked': 0,
                'disagree_clicked': 1,
                'funny_clicked': 1
}

negative_review = {
    'professor_id': 3,
    'first_name': 'Jae W',
    'last_name': 'Lee',
    'uni': 'jwl3',
    'review_id': 4,
    'content': 'demo content 4',
    'workload': 'demo workload 4',
                'rating': 1,
                'submission_date': datetime.strptime('2019-10-13', '%Y-%m-%d'),
                'agrees': 0,
                'disagrees': 0,
                'funnys': 0,
                'agree_clicked': 0,
                'disagree_clicked': 0,
                'funny_clicked': 0
}

positive_review_json = {
    'content': 'demo content 1',
    'deprecated': False,
    'reviewHeader': {
        'profFirstName': 'Jae W',
        'profId': 3,
        'profLastName': 'Lee',
                        'uni': 'jwl3'
    },
    'reviewId': 1,
    'reviewType': 'course',
    'submissionDate': 'Oct 13, 2019',
    'votes': {
        'downvoteClicked': True,
        'funnyClicked': True,
        'initDownvoteCount': 2,
        'initFunnyCount': 1,
        'initUpvoteCount': 1,
        'upvoteClicked': False
    },
    'workload': 'demo workload 1'
}

negative_review_json = {
    'content': 'demo content 4',
    'deprecated': False,
    'reviewHeader': {
        'profFirstName': 'Jae W',
        'profId': 3,
        'profLastName': 'Lee',
                        'uni': 'jwl3'
    },
    'reviewId': 4,
    'reviewType': 'course',
    'submissionDate': 'Oct 13, 2019',
    'votes': {
        'downvoteClicked': False,
        'funnyClicked': False,
        'initDownvoteCount': 0,
        'initFunnyCount': 0,
        'initUpvoteCount': 0,
        'upvoteClicked': False
    },
    'workload': 'demo workload 4'
}


class CoursesTest(BaseTest):
    @mock.patch('api.blueprints.course.get_course_review_summary')
    @mock.patch('api.blueprints.course.load_course_professors')
    @mock.patch('api.blueprints.course.load_course_basic_info')
    def test_get_course_info(
            self, mock_load_course_basic_info, mock_load_course_professors,
            mock_get_course_review_summary):
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
        mock_get_course_review_summary.return_value = [
            positive_review,
            negative_review,
        ]
        expected_res = {
            'courseSummary': {
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
            },
            'reviewSummary': {
                'negativeReview': negative_review_json,
                'positiveReview': positive_review_json
            }
        }

        res = self.client.get(f'/api/course/{ML_COURSE_ID}')
        self.assertEqual(expected_res, res.json)

    @mock.patch('api.blueprints.course.get_course_review_summary')
    @mock.patch('api.blueprints.course.load_course_professors')
    @mock.patch('api.blueprints.course.load_course_basic_info')
    def test_get_course_info_no_professors(
            self, mock_load_course_basic_info, mock_load_course_professors,
            mock_get_course_review_summary):
        mock_load_course_basic_info.return_value = [{
            'course_id': ML_COURSE_ID,
            'name': 'Machine Learning',
            'department_id': 1,
            'call_number': 'COMS 4771',
            'department_name': 'Computer Science',
        }]
        mock_load_course_professors.return_value = []
        mock_get_course_review_summary.return_value = [
            positive_review,
            negative_review,
        ]
        expected_res = {
            'courseSummary': {
                'courseName': 'Machine Learning',
                'courseCallNumber': 'COMS 4771',
                'departmentId': 1,
                'departmentName': 'Computer Science',
                'courseProfessors': []
            },
            'reviewSummary': {
                'negativeReview': negative_review_json,
                'positiveReview': positive_review_json
            }
        }

        res = self.client.get(f'/api/course/{ML_COURSE_ID}')
        self.assertEqual(expected_res, res.json)

    @mock.patch('api.blueprints.course.get_course_review_summary')
    @mock.patch('api.blueprints.course.load_course_professors')
    @mock.patch('api.blueprints.course.load_course_basic_info')
    def test_get_course_info_empty(
            self, mock_load_course_basic_info, mock_load_course_professors,
            mock_get_course_review_summary):
        mock_load_course_basic_info.return_value = []
        mock_load_course_professors.return_value = []
        mock_get_course_review_summary.return_value = []
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

    @mock.patch('api.blueprints.course.get_course_review_summary')
    @mock.patch('api.blueprints.course.get_department_professors')
    @mock.patch('api.blueprints.course.get_course')
    def test_course_summary_no_review_summary(
        self, mock_get_course,
        mock_get_department_professors,
        mock_get_course_review_summary
    ):
        course_id = 1

        mock_get_course.return_value = [{
            'course_id': course_id,
            'name': 'Machine Learning',
            'department_id': 1,
            'call_number': 'COMS 4771',
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

        mock_get_course_review_summary.return_value = []

        expected_res = {
            'courseSummary': {
                'associatedProfessors': [{
                    'firstName': 'Nakul',
                    'lastName': 'Verma',
                    'profDepartments': [
                        {'profDepartmentId': 1,
                         'profDepartmentName': 'Computer Science'},
                        {'profDepartmentId': 2,
                         'profDepartmentName': 'Law'}
                    ],
                    'professorId': 2
                }],
                'courseCallNumber': 'COMS 4771',
                'courseName': 'Machine Learning',
                'departmentId': 1,
                'departmentName': 'Computer Science'},
            'reviewSummary': {}
        }

        res = self.client.get(f'/api/course/{course_id}')
        self.assertDictEqual(expected_res, res.json)

    @mock.patch('api.blueprints.course.get_course_review_summary')
    @mock.patch('api.blueprints.course.get_department_professors')
    @mock.patch('api.blueprints.course.get_course')
    def test_course_summary_one_review_summary(
        self, mock_get_course,
        mock_get_department_professors,
        mock_get_course_review_summary
    ):
        course_id = 1

        mock_get_course.return_value = [{
            'course_id': course_id,
            'name': 'Machine Learning',
            'department_id': 1,
            'call_number': 'COMS 4771',
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

        mock_get_course_review_summary.return_value = [
            positive_review,
        ]

        expected_res = {
            "courseSummary": {
                "associatedProfessors": [{
                    "firstName": "Nakul",
                    "lastName": "Verma",
                    "profDepartments": [
                        {"profDepartmentId": 1,
                         "profDepartmentName": "Computer Science"},
                        {"profDepartmentId": 2, "profDepartmentName": "Law"}
                    ],
                    "professorId": 2
                }],
                "courseCallNumber": "COMS 4771",
                "courseName": "Machine Learning",
                "departmentId": 1,
                "departmentName": "Computer Science"
            },
            "reviewSummary": {
                "mostAgreedReview": positive_review_json,
            }
        }

        res = self.client.get(f'/api/course/{course_id}')

        self.assertDictEqual(expected_res, res.json)
