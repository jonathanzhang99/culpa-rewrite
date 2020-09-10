from unittest import mock
from datetime import datetime

from pymysql.err import IntegrityError

from api.blueprints.review import parse_review
from api.tests import BaseTest


class ReviewTest(BaseTest):
    PROFESSOR_ID = 1
    PROFESSOR_TITLE = 'Nakul Verma'
    COURSE_ID = 2
    COURSE_PROFESSOR_ID = 3
    CONTENT = 'perceptrons! svms! neural networks! HMMs!'
    WORKLOAD = 'death by homework or teammates'
    EVALUATION = 5
    IP_ADDRESS = '127.0.0.1'
    BASE_REVIEW_DATA = {
        'content': CONTENT,
        'workload': WORKLOAD,
        'evaluation': EVALUATION,
    }

    @mock.patch('api.blueprints.review.insert_review')
    def test_insert_valid_review(self, mock_insert_review):
        mock_insert_review.return_value = 0

        review_data = dict(self.BASE_REVIEW_DATA,
                           professor={
                               'title': self.PROFESSOR_TITLE,
                               'id': self.PROFESSOR_ID
                           },
                           course=self.COURSE_PROFESSOR_ID)

        expected_res = {'reviewId': 0}

        res = self.client.post('/api/review/submit',
                               json=review_data,
                               environ_base={'REMOTE_ADDR': '127.0.0.1'})

        mock_insert_review.assert_called_with(self.COURSE_PROFESSOR_ID,
                                              self.CONTENT,
                                              self.WORKLOAD,
                                              self.EVALUATION,
                                              self.IP_ADDRESS)
        self.assertEqual(expected_res, res.json)

    @mock.patch('api.blueprints.review.insert_review')
    def test_insert_invalid_review(self, mock_insert_review):
        mock_insert_review.return_value = 0

        review_data = dict(self.BASE_REVIEW_DATA,
                           course=self.COURSE_PROFESSOR_ID)

        expected_error = {'error': 'Missing inputs'}
        for removed_key in review_data.keys():
            with self.subTest(removed_key):
                invalid_review_data = {k: v for k, v in review_data.items()
                                       if k != removed_key}

                res = self.client.post('/api/review/submit',
                                       json=invalid_review_data,
                                       environ_base={
                                           'REMOTE_ADDR': '127.0.0.1'
                                        })

                self.assertEqual(res.status_code, 400)
                self.assertEqual(expected_error, res.json)

    @mock.patch('api.blueprints.review.insert_review',
                side_effect=IntegrityError)
    def test_insert_invalid_review_db_error(self, mock_insert_review):
        review_data = dict(self.BASE_REVIEW_DATA,
                           professor={
                               'title': self.PROFESSOR_TITLE,
                               'id': self.PROFESSOR_ID
                           },
                           course=self.COURSE_PROFESSOR_ID)
        expected_error = {'error': 'Invalid data'}

        res = self.client.post('/api/review/submit',
                               json=review_data,
                               environ_base={'REMOTE_ADDR': '127.0.0.1'})

        self.assertEqual(res.status_code, 400)
        self.assertEqual(expected_error, res.json)

    @mock.patch('api.blueprints.review.load_professor_basic_info_by_uni')
    @mock.patch('api.blueprints.review.add_course_professor')
    @mock.patch('api.blueprints.review.insert_review')
    def test_insert_new_professor(self,
                                  mock_insert_review,
                                  mock_add_course_professor,
                                  mock_load_professor_basic_info_by_uni):
        mock_insert_review.return_value = 0
        mock_add_course_professor.return_value = self.COURSE_PROFESSOR_ID

        # note that the actual function returns a list of dictionaries
        mock_load_professor_basic_info_by_uni.return_value = False

        new_professor_data = {
            'first_name': 'Nakul',
            'last_name': 'Verma',
            'uni': 'nv2274',
            'department': 1,
            'course': {'title': 'Machine Learning', 'id': self.COURSE_ID}
        }
        review_data = dict(self.BASE_REVIEW_DATA,
                           newProfessor=new_professor_data)

        res = self.client.post('/api/review/submit',
                               json=review_data,
                               environ_base={'REMOTE_ADDR': self.IP_ADDRESS})

        mock_load_professor_basic_info_by_uni.assert_called_with('nv2274')
        mock_add_course_professor.assert_called_with(new_professor_data,
                                                     self.COURSE_ID)
        mock_insert_review.assert_called_with(self.COURSE_PROFESSOR_ID,
                                              self.CONTENT,
                                              self.WORKLOAD,
                                              self.EVALUATION,
                                              self.IP_ADDRESS)
        expected_res = {'reviewId': 0}
        self.assertEqual(expected_res, res.json)

    @mock.patch('api.blueprints.review.load_professor_basic_info_by_uni')
    @mock.patch('api.blueprints.review.add_course_professor')
    @mock.patch('api.blueprints.review.insert_review')
    def test_insert_new_professor_and_new_course(
            self,
            mock_insert_review,
            mock_add_course_professor,
            mock_load_professor_basic_info_by_uni):
        mock_insert_review.return_value = 0
        mock_add_course_professor.return_value = self.COURSE_PROFESSOR_ID

        # note that the actual function returns a list of dictionaries
        mock_load_professor_basic_info_by_uni.return_value = False

        new_course_data = {
            'name': 'Machine Learning',
            'code': 'COMS 4771',
            'department': 99
        }

        new_professor_data = {
            'first_name': 'Nakul',
            'last_name': 'Verma',
            'uni': 'nv2274',
            'department': 1,
            'course': {'title': 'Add new course dialog', 'id': -1}
        }
        review_data = dict(self.BASE_REVIEW_DATA,
                           newProfessor=new_professor_data,
                           newCourse=new_course_data)

        res = self.client.post('/api/review/submit',
                               json=review_data,
                               environ_base={'REMOTE_ADDR': self.IP_ADDRESS})

        mock_load_professor_basic_info_by_uni.assert_called_with('nv2274')
        mock_add_course_professor.assert_called_with(new_professor_data,
                                                     new_course_data)
        mock_insert_review.assert_called_with(self.COURSE_PROFESSOR_ID,
                                              self.CONTENT,
                                              self.WORKLOAD,
                                              self.EVALUATION,
                                              self.IP_ADDRESS)
        expected_res = {'reviewId': 0}
        self.assertEqual(expected_res, res.json)

    @mock.patch('api.blueprints.review.add_course_professor')
    @mock.patch('api.blueprints.review.insert_review')
    def test_add_existing_course_and_professor(self,
                                               mock_insert_review,
                                               mock_add_course_professor):
        mock_insert_review.return_value = 0
        mock_add_course_professor.return_value = self.COURSE_PROFESSOR_ID

        new_course_data = {
            'search': {'title': 'Machine Learning', 'id': self.COURSE_ID}
        }

        review_data = dict(self.BASE_REVIEW_DATA,
                           professor={
                               'title': self.PROFESSOR_TITLE,
                               'id': self.PROFESSOR_ID
                           },
                           newCourse=new_course_data)

        res = self.client.post('/api/review/submit',
                               json=review_data,
                               environ_base={'REMOTE_ADDR': self.IP_ADDRESS})

        mock_add_course_professor.assert_called_with(self.PROFESSOR_ID,
                                                     self.COURSE_ID)
        mock_insert_review.assert_called_with(self.COURSE_PROFESSOR_ID,
                                              self.CONTENT,
                                              self.WORKLOAD,
                                              self.EVALUATION,
                                              self.IP_ADDRESS)
        expected_res = {'reviewId': 0}
        self.assertEqual(expected_res, res.json)

    @mock.patch('api.blueprints.review.add_course_professor')
    @mock.patch('api.blueprints.review.insert_review')
    def test_add_new_course_and_existing_professor(self,
                                                   mock_insert_review,
                                                   mock_add_course_professor):
        mock_insert_review.return_value = 0
        mock_add_course_professor.return_value = self.COURSE_PROFESSOR_ID

        new_course_data = {
            'name': 'Machine Learning',
            'code': 'COMS 4771',
            'department': 99
        }

        review_data = dict(self.BASE_REVIEW_DATA,
                           professor={
                               'title': self.PROFESSOR_TITLE,
                               'id': self.PROFESSOR_ID
                           },
                           newCourse=new_course_data)

        res = self.client.post('/api/review/submit',
                               json=review_data,
                               environ_base={'REMOTE_ADDR': self.IP_ADDRESS})

        mock_add_course_professor.assert_called_with(self.PROFESSOR_ID,
                                                     new_course_data)
        mock_insert_review.assert_called_with(self.COURSE_PROFESSOR_ID,
                                              self.CONTENT,
                                              self.WORKLOAD,
                                              self.EVALUATION,
                                              self.IP_ADDRESS)
        expected_res = {'reviewId': 0}
        self.assertEqual(expected_res, res.json)

    @mock.patch('api.blueprints.review.load_professor_basic_info_by_uni')
    def test_add_existing_professor_throws_error(
            self,
            mock_load_professor_basic_info_by_uni):
        mock_load_professor_basic_info_by_uni.return_value = True

        new_professor_data = {
            'first_name': 'Nakul',
            'last_name': 'Verma',
            'uni': 'nv2274',
            'department': 1,
            'course': {'title': 'Machine Learning', 'id': self.COURSE_ID}
        }

        review_data = dict(self.BASE_REVIEW_DATA,
                           newProfessor=new_professor_data)

        res = self.client.post('/api/review/submit',
                               json=review_data,
                               environ_base={'REMOTE_ADDR': self.IP_ADDRESS})

        expected_res = {
            'error': 'Professor already exists. Try searching by UNI.'
        }
        self.assertEqual(res.status_code, 400)
        self.assertEqual(expected_res, res.json)

    def test_parse_review(self):
        types = [{
            'review_type': 'course',
            'header_data': {
                'professor_id': 12345,
                'uni': '12345',
                'first_name': 'John',
                'last_name': 'Doe',
            },
            'expected_review_header': {
                'profId': 12345,
                'profFirstName': 'John',
                'profLastName': 'Doe',
                'uni': '12345',
                'badges': [],
            }
        }, {
            'review_type': 'professor',
            'header_data': {
                'course_id': 12345,
                'name': 'testtest',
                'call_number': '12345'
            },
            'expected_review_header': {
                'courseId': 12345,
                'courseName': 'testtest',
                'courseCallNumber': '12345'
            }
        }, {
            'review_type': 'all',
            'header_data': {
                'course_id': 1234,
                'course_name': 'test course',
                'course_call_number': 'test call number',
                'prof_id': 5678,
                'prof_first_name': 'John',
                'prof_last_name': 'Doe',
                'prof_uni': 'jd2910'
            },
            'expected_review_header': {
                'course': {
                    'courseId': 1234,
                    'courseName': 'test course',
                    'courseCode': 'test call number'
                },
                'professor': {
                    'profId': 5678,
                    'profFirstName': 'John',
                    'profLastName': 'Doe',
                    'uni': 'jd2910',
                    'badges': [],
                }
            }
        }]
        dates = [
            {
                'submission_date': datetime.strptime('2014-01-01', '%Y-%m-%d'),
                'formatted_date': 'Jan 01, 2014',
                'deprecated': True
            },
            {
                'submission_date': datetime.strptime('2019-01-01', '%Y-%m-%d'),
                'formatted_date': 'Jan 01, 2019',
                'deprecated': False
            },
        ]

        review = {
            'agrees': -1,
            'disagrees': -2,
            'funnys': -3,
            'agree_clicked': True,
            'disagree_clicked': False,
            'funny_clicked': False,
            'review_id': 12333,
            'content': 'test content',
            'workload': 'test workload',
            'rating': 4,
        }

        for type_ in types:
            for date in dates:
                with self.subTest(type_=type_, date=date):
                    review.update(type_['header_data'])
                    review['submission_date'] = date['submission_date']

                    with self.app.app_context():
                        res = parse_review(review, type_['review_type'])

                    self.assertEqual(res, {
                        'reviewType': type_['review_type'],
                        'reviewHeader': type_['expected_review_header'],
                        'votes': {
                            'initUpvoteCount': review['agrees'],
                            'initDownvoteCount': review['disagrees'],
                            'initFunnyCount': review['funnys'],
                            'upvoteClicked': review['agree_clicked'],
                            'downvoteClicked': review['disagree_clicked'],
                            'funnyClicked': review['funny_clicked']
                        },
                        'submissionDate': date['formatted_date'],
                        'workload': review['workload'],
                        'content': review['content'],
                        'reviewId': review['review_id'],
                        'deprecated': date['deprecated']
                    })

    @mock.patch("api.blueprints.review.prepare_professor_query_prefix")
    @mock.patch("api.blueprints.review.prepare_course_query_prefix")
    @mock.patch("api.blueprints.review.get_reviews_with_query_prefix")
    def test_get_reviews_valid(
        self,
        get_reviews_with_query_prefix_mock,
        course_query_prefix_mock,
        professor_query_prefix_mock
    ):
        db_sort_specs = {
            '': ['submission_date', 'DESC'],
            'most_positive': ['rating', 'DESC'],
            'most_negative': ['rating', 'ASC'],
            'newest': ['submission_date', 'DESC'],
            'oldest': ['submission_date', 'ASC'],
            'most_agreed': ['agrees', 'DESC'],
            'most_disagreed': ['disagrees', 'DESC']
        }
        filters = [{
            'filter_list': '1,2,3,4',
            'filter_list_array': [1, 2, 3, 4],
            'filter_year': 10,
            'filter_year_arg': 10,
        }, {
            'filter_list': '5,6,7',
            'filter_list_array': [5, 6, 7],
            'filter_year': '',
            'filter_year_arg': None
        }, {
            'filter_list': '',
            'filter_list_array': None,
            'filter_year': 2,
            'filter_year_arg': 2
        }, {
            'filter_list': '',
            'filter_list_array': None,
            'filter_year': '',
            'filter_year_arg': None
        }]
        cases = [{
            'type': 'professor',
            'id': 12345,
            'fn': professor_query_prefix_mock,
            'fn_return': 'professor_mock_fn_return'
        }, {
            'type': 'course',
            'id': 56789,
            'fn': course_query_prefix_mock,
            'fn_return': 'course_mock_fn_return'
        }]
        ip = 3, "123.456.78.910"

        for case in cases:
            for sorting in db_sort_specs:
                for filter_val in filters:
                    with self.subTest(
                        case=case,
                        sorting=sorting,
                        filter_val=filter_val
                    ):
                        case['fn'].return_value = case['fn_return']
                        self.client.get(
                            f'/api/review/get/{case["type"]}/{case["id"]}'
                            f'?sorting={sorting}'
                            f'&filterYear={filter_val["filter_year"]}'
                            f'&filterList={filter_val["filter_list"]}',
                            environ_base={'REMOTE_ADDR': ip}
                        )

                        case['fn'].assert_called_with(
                            case['id'],
                            filter_val['filter_list_array']
                        )

                        sort_criterion, sort_order = db_sort_specs[sorting]
                        get_reviews_with_query_prefix_mock.assert_called_with(
                            case['fn_return'],
                            ip,
                            sort_criterion,
                            sort_order,
                            filter_val['filter_year_arg']
                        )

    @mock.patch("api.blueprints.review.prepare_professor_query_prefix")
    @mock.patch("api.blueprints.review.prepare_course_query_prefix")
    @mock.patch("api.blueprints.review.get_reviews_with_query_prefix")
    def test_get_reviews_invalid_type(
        self,
        get_reviews_with_query_prefix_mock,
        course_query_prefix_mock,
        professor_query_prefix_mock
    ):
        page_type = 'invalid'
        res = self.client.get(
            f"/api/review/get/{page_type}/1"
        )

        self.assertEqual(res.status_code, 400)
        self.assertEqual(res.json, {"error": 'invalid page type'})

        get_reviews_with_query_prefix_mock.assert_not_called()
        course_query_prefix_mock.assert_not_called()
        professor_query_prefix_mock.assert_not_called()

    @mock.patch("api.blueprints.review.load_review")
    @mock.patch("api.blueprints.review.parse_review")
    def test_get_single_review_card_data(
        self,
        parse_review_mock,
        load_review_mock
    ):
        review_id = 1
        cases = [{
            'flag': 'approved',
            'review': 'test return value',
            'review_json': 'test return value'
        }, {
            'flag': 'libel',
            'review': 'test return value',
            'review_json': {'reviewId': review_id}
        }, {
            'flag': 'pending',
            'review': 'test return value',
            'review_json': {'reviewId': review_id}
        }]

        for case in cases:
            with self.subTest(case):
                load_review_mock.return_value = {
                    'flag_type': case['flag'],
                    'other_fields': case['review']
                }
                parse_review_mock.return_value = case['review']
                res = self.client.get(f"/api/review/{review_id}")

                self.assertEqual(res.json, {
                    'flag': case['flag'],
                    'review': case['review_json']
                })
