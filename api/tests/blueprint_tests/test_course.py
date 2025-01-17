from unittest import mock
from datetime import datetime
from pymysql.err import IntegrityError
from api.tests import BaseTest


class CoursesTest(BaseTest):
    ML_COURSE_ID = 1
    BAD_COURSE_ID = 999999

    POSITIVE_REVIEW = {
        'badges': '[null, null]',
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
        'funny_clicked': 1,
    }

    NEGATIVE_REVIEW = {
        'badges': '[null]',
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
        'funny_clicked': 0,
    }

    POSITIVE_REVIEW_JSON = {
        'content': 'demo content 1',
        'deprecated': False,
        'reviewHeader': {
            'profFirstName': 'Jae W',
            'profId': 3,
            'profLastName': 'Lee',
            'uni': 'jwl3',
            'badges': [],
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

    NEGATIVE_REVIEW_JSON = {
        'content': 'demo content 4',
        'deprecated': False,
        'reviewHeader': {
            'profFirstName': 'Jae W',
            'profId': 3,
            'profLastName': 'Lee',
            'uni': 'jwl3',
            'badges': [],
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

    @mock.patch('api.blueprints.course.load_review_highlight')
    @mock.patch('api.blueprints.course.load_course_professors')
    @mock.patch('api.blueprints.course.load_course_basic_info')
    def test_get_course_info_two_review_highlights(
      self,
      mock_load_course_basic_info,
      mock_load_course_professors,
      mock_load_review_highlight):
        mock_load_course_basic_info.return_value = [{
            'course_id': self.ML_COURSE_ID,
            'name': 'Machine Learning',
            'department_id': 1,
            'call_number': 'COMS 4771',
            'department_name': 'Computer Science',
        }]
        mock_load_course_professors.return_value = [{
            'professor_id': 1,
            'first_name': 'Nakul',
            'last_name': 'Verma',
            'department_ids': '[1, 3, 1, 3]',
            'department_names': '["Computer Science", "Mathematics", '
                              + '"Computer Science", "Mathematics"]',
            'badges': '[1, 1, 2, 2]',
        }]
        mock_load_review_highlight.return_value = [
            self.POSITIVE_REVIEW,
            self.NEGATIVE_REVIEW,
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
                    }],
                    'badges': [1, 2],
                }]
            },
            'courseReviewHighlight': [
                self.POSITIVE_REVIEW_JSON,
                self.NEGATIVE_REVIEW_JSON
            ]
        }

        res = self.client.get(f'/api/course/{self.ML_COURSE_ID}')
        self.assertEqual(expected_res, res.json)

    @mock.patch('api.blueprints.course.load_review_highlight')
    @mock.patch('api.blueprints.course.load_course_professors')
    @mock.patch('api.blueprints.course.load_course_basic_info')
    def test_get_course_info_one_review_highlight(
            self,
            mock_load_course_basic_info,
            mock_load_course_professors,
            mock_load_review_highlight):
        mock_load_course_basic_info.return_value = [{
            'course_id': self.ML_COURSE_ID,
            'name': 'Machine Learning',
            'department_id': 1,
            'call_number': 'COMS 4771',
            'department_name': 'Computer Science',
        }]
        mock_load_course_professors.return_value = [{
            'professor_id': 1,
            'first_name': 'Nakul',
            'last_name': 'Verma',
            'department_ids': '[1, 3, 1, 3]',
            'department_names': '["Computer Science", "Mathematics", '
                              + '"Computer Science", "Mathematics"]',
            'badges': '[1, 1, 2, 2]',
        }]
        mock_load_review_highlight.return_value = [
            self.POSITIVE_REVIEW,
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
                    }],
                    'badges': [1, 2],
                }]
            },
            'courseReviewHighlight': [
                self.POSITIVE_REVIEW_JSON
            ]
        }

        res = self.client.get(f'/api/course/{self.ML_COURSE_ID}')
        self.assertEqual(expected_res, res.json)

    @mock.patch('api.blueprints.course.load_review_highlight')
    @mock.patch('api.blueprints.course.load_course_professors')
    @mock.patch('api.blueprints.course.load_course_basic_info')
    def test_course_info_no_review_highlight(
            self,
            mock_load_course_basic_info,
            mock_load_course_professors,
            mock_load_review_highlight):
        mock_load_course_basic_info.return_value = [{
            'course_id': self.ML_COURSE_ID,
            'name': 'Machine Learning',
            'department_id': 1,
            'call_number': 'COMS 4771',
            'department_name': 'Computer Science',
        }]
        mock_load_course_professors.return_value = [{
            'professor_id': 1,
            'first_name': 'Nakul',
            'last_name': 'Verma',
            'department_ids': '[1, 3, 1, 3]',
            'department_names': '["Computer Science", "Mathematics", '
                              + '"Computer Science", "Mathematics"]',
            'badges': '[1, 1, 2, 2]',
        }]
        mock_load_review_highlight.return_value = []
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
                    }],
                    'badges': [1, 2],
                }]
            },
            'courseReviewHighlight': []
        }

        res = self.client.get(f'/api/course/{self.ML_COURSE_ID}')
        self.assertDictEqual(expected_res, res.json)

    @mock.patch('api.blueprints.course.load_review_highlight')
    @mock.patch('api.blueprints.course.load_course_professors')
    @mock.patch('api.blueprints.course.load_course_basic_info')
    def test_get_course_info_no_professors(
            self,
            mock_load_course_basic_info,
            mock_load_course_professors,
            mock_load_review_highlight):
        mock_load_course_basic_info.return_value = [{
            'course_id': self.ML_COURSE_ID,
            'name': 'Machine Learning',
            'department_id': 1,
            'call_number': 'COMS 4771',
            'department_name': 'Computer Science',
        }]
        mock_load_course_professors.return_value = []
        mock_load_review_highlight.return_value = [
            self.POSITIVE_REVIEW,
            self.NEGATIVE_REVIEW,
        ]
        expected_res = {
            'courseReviewHighlight': [
                self.POSITIVE_REVIEW_JSON,
                self.NEGATIVE_REVIEW_JSON
            ],
            'courseSummary': {
                'courseName': 'Machine Learning',
                'courseCallNumber': 'COMS 4771',
                'departmentId': 1,
                'departmentName': 'Computer Science',
                'courseProfessors': []
            }
        }
        res = self.client.get(f'/api/course/{self.ML_COURSE_ID}')
        self.assertEqual(expected_res, res.json)

    @mock.patch('api.blueprints.course.load_review_highlight')
    @mock.patch('api.blueprints.course.load_course_professors')
    @mock.patch('api.blueprints.course.load_course_basic_info')
    def test_course_info_multiple_course_professors(
            self,
            mock_load_course_basic_info,
            mock_load_course_professors,
            mock_load_review_highlight):
        mock_load_course_basic_info.return_value = [{
            'course_id': self.ML_COURSE_ID,
            'name': 'Machine Learning',
            'department_id': 1,
            'call_number': 'COMS 4771',
            'department_name': 'Computer Science',
        }]
        mock_load_course_professors.return_value = [{
            'professor_id': 2,
            'first_name': 'Jae Woo',
            'last_name': 'Lee',
            'department_ids': '[1]',
            'department_names': '["Computer Science"]',
            'badges': '[null]',
        }, {
            'professor_id': 1,
            'first_name': 'Nakul',
            'last_name': 'Verma',
            'department_ids': '[1, 3, 1, 3]',
            'department_names': '["Computer Science", "Mathematics", '
                              + '"Computer Science", "Mathematics"]',
            'badges': '[1, 1, 2, 2]',
        }]
        mock_load_review_highlight.return_value = [
            self.POSITIVE_REVIEW,
            self.NEGATIVE_REVIEW,
        ]
        expected_res = {
            'courseReviewHighlight': [
                self.POSITIVE_REVIEW_JSON,
                self.NEGATIVE_REVIEW_JSON
            ],
            'courseSummary': {
                'courseName': 'Machine Learning',
                'courseCallNumber': 'COMS 4771',
                'departmentId': 1,
                'departmentName': 'Computer Science',
                'courseProfessors': [{
                    'firstName': 'Jae Woo',
                    'lastName': 'Lee',
                    'professorId': 2,
                    'professorDepartments': [{
                        'professorDepartmentId': 1,
                        'professorDepartmentName': 'Computer Science'
                    }],
                    'badges': [],
                }, {
                    'firstName': 'Nakul',
                    'lastName': 'Verma',
                    'professorId': 1,
                    'professorDepartments': [{
                        'professorDepartmentId': 1,
                        'professorDepartmentName': 'Computer Science'
                    }, {
                        'professorDepartmentId': 3,
                        'professorDepartmentName': 'Mathematics'
                    }],
                    'badges': [1, 2],
                }]
            }
        }
        res = self.client.get(f'/api/course/{self.ML_COURSE_ID}')
        self.assertEqual(expected_res, res.json)

    @mock.patch('api.blueprints.course.load_course_basic_info')
    def test_load_course_info_empty(self, mock_load_course_basic_info):
        mock_load_course_basic_info.return_value = []
        expected_res = {'error': 'Missing course basic info'}

        res = self.client.get(f'/api/course/{self.BAD_COURSE_ID}')
        self.assertEqual(res.status_code, 404)
        self.assertEqual(expected_res, res.json)

    @mock.patch('api.blueprints.course.load_course_basic_info')
    def test_load_course_info_db_failure(self, mock_load_course_basic_info):
        mock_load_course_basic_info.side_effect = IntegrityError()
        expected_res = {'error': 'Invalid data'}

        res = self.client.get(f'/api/course/{self.ML_COURSE_ID}')
        self.assertEqual(expected_res, res.json)
