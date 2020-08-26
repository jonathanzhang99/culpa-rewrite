from unittest import mock
from datetime import datetime
from pymysql.err import IntegrityError

from api.tests import BaseTest

review_summary_return = [{
    'course_professor_id': 1,
    'review_id': 1,
    'content': 'This is a review',
    'workload': '',
    'rating': 5,
    'submission_date': datetime(2020, 1, 15, 0, 0),
    'agrees': 10,
    'disagrees': 2,
    'funnys': 27,
    'agree_clicked': False,
    'disagree_clicked': False,
    'funny_clicked': False,
},
    {
    'course_professor_id': 1,
    'review_id': 1,
    'content': 'This is a review',
    'workload': '',
    'rating': 5,
    'submission_date': datetime(2020, 1, 15, 0, 0),
    'agrees': 10,
    'disagrees': 2,
    'funnys': 27,
    'agree_clicked': False,
    'disagree_clicked': False,
    'funny_clicked': False,
}]

review_summary = {
    "negativeReview": {
        "content": "This is a review",
        "deprecated": False,
        "reviewHeader": {
            "courseCode": "COMS 4771",
            "courseId": "1",
            "courseName": "Machine Learning"
        },
        "reviewId": 1,
        "reviewType": "professor",
        "submissionDate": "Wed, 15 Jan 2020 00:00:00 GMT",
        "votes": {
            "downvoteClicked": False,
            "funnyClicked": False,
            "initDownvoteCount": 2,
            "initFunnyCount": 27,
            "initUpvoteCount": 10,
            "upvoteClicked": False
        },
        "workload": ""
    },
    "positiveReview": {
        "content": "This is a review",
        "deprecated": False,
        "reviewHeader": {
            "courseCode": "COMS 4771",
            "courseId": "1",
            "courseName": "Machine Learning"
        },
        "reviewId": 1,
        "reviewType": "professor",
        "submissionDate": "Wed, 15 Jan 2020 00:00:00 GMT",
        "votes": {
            "downvoteClicked": False,
            "funnyClicked": False,
            "initDownvoteCount": 2,
            "initFunnyCount": 27,
            "initUpvoteCount": 10,
            "upvoteClicked": False
        },
        "workload": ""
    }
}


class CoursesTest(BaseTest):

    @mock.patch('api.blueprints.course.get_course_review_summary')
    @mock.patch('api.blueprints.course.get_department_professors')
    @mock.patch('api.blueprints.course.get_course')
    def test_course_summary(self, mock_get_course,
                            mock_get_department_professors,
                            mock_get_course_review_summary):
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

        mock_get_course_review_summary.return_value = review_summary_return

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
            "reviewSummary": review_summary
        }

        res = self.client.get(f'/api/course/{course_id}')

        self.assertDictEqual(expected_res, res.json)

    @mock.patch('api.blueprints.course.get_course_review_summary')
    @mock.patch('api.blueprints.course.get_department_professors')
    @mock.patch('api.blueprints.course.get_course')
    def test_course_summary_no_course(self, mock_get_course,
                                      mock_get_department_professors,
                                      mock_get_course_review_summary):
        course_id = 20

        mock_get_course.return_value = []

        mock_get_department_professors.return_value = []

        mock_get_course_review_summary.return_value = []

        expected_res = {'error': 'course not found'}
        res = self.client.get(f'/api/course/{course_id}')

        self.assertDictEqual(expected_res, res.json)

    @mock.patch('api.blueprints.course.get_course_review_summary')
    @mock.patch('api.blueprints.course.get_department_professors')
    @mock.patch('api.blueprints.course.get_course')
    def test_course_summary_no_professors(self, mock_get_course,
                                          mock_get_department_professors,
                                          mock_get_course_review_summary):
        course_id = 1

        mock_get_course.return_value = [{
            'course_id': course_id,
            'name': 'Machine Learning',
            'department_id': 1,
            'call_number': 'COMS 4771',
            'department_name': 'Computer Science',
        }]

        mock_get_department_professors.return_value = []

        mock_get_course_review_summary.return_value = review_summary_return

        expected_res = {'courseSummary': {
            'courseName': 'Machine Learning',
            'courseCallNumber': 'COMS 4771',
            'departmentId': 1,
            'departmentName': 'Computer Science',
            'associatedProfessors': []},
            'reviewSummary': review_summary
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

    @mock.patch('api.blueprints.course.get_course_review_summary')
    @mock.patch('api.blueprints.course.get_department_professors')
    @mock.patch('api.blueprints.course.get_course')
    def test_course_summary_no_review_summary(self, mock_get_course,
                                              mock_get_department_professors,
                                              mock_get_course_review_summary):
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
    def test_course_summary_one_review_summary(self, mock_get_course,
                                               mock_get_department_professors,
                                               mock_get_course_review_summary):
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

        mock_get_course_review_summary.return_value = [{
            'course_professor_id': 1,
            'review_id': 1,
            'content': 'This is a review',
            'workload': '',
            'rating': 5,
            'submission_date': datetime(2020, 1, 15, 0, 0),
            'agrees': 10,
            'disagrees': 2,
            'funnys': 27,
            'agree_clicked': False,
            'disagree_clicked': False,
            'funny_clicked': False,
        }]

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
                "mostAgreedReview": {
                    "content": "This is a review",
                    "deprecated": False,
                    "reviewHeader": {
                        "courseCode": "COMS 4771",
                        "courseId": "1",
                        "courseName": "Machine Learning"
                    },
                    "reviewId": 1,
                    "reviewType": "professor",
                    "submissionDate": "Wed, 15 Jan 2020 00:00:00 GMT",
                    "votes": {
                        "downvoteClicked": False,
                        "funnyClicked": False,
                        "initDownvoteCount": 2,
                        "initFunnyCount": 27,
                        "initUpvoteCount": 10,
                        "upvoteClicked": False
                    },
                    "workload": ""
                }
            }
        }

        res = self.client.get(f'/api/course/{course_id}')

        self.assertDictEqual(expected_res, res.json)
