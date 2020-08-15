from unittest import mock
from datetime import datetime

from pymysql.err import IntegrityError

from api.blueprints.review import parse_review
from api.tests import BaseTest


class ReviewTest(BaseTest):
    @mock.patch('api.blueprints.review.insert_review')
    def test_insert_valid_review(self, mock_insert_review):
        mock_insert_review.return_value = 0

        review_data = {
            'course': 99,
            'content': 'perceptrons! svms! neural networks! HMMs!',
            'workload': 'death by homework or teammates',
            'evaluation': 5,
        }

        expected_res = {'reviewId': 0}

        res = self.app.post('/api/review/submit',
                            json=review_data,
                            environ_base={'REMOTE_ADDR': '127.0.0.1'})

        self.assertEqual(expected_res, res.json)

    @mock.patch('api.blueprints.review.insert_review')
    def test_insert_invalid_review(self, mock_insert_review):
        mock_insert_review.return_value = 0

        review_data = {
            'course': 99,
            'content': 'perceptrons! svms! neural networks! HMMs!',
            'workload': 'death by homework or teammates',
            'evaluation': 5,
        }

        expected_error = {'error': 'Missing inputs'}
        for removed_key in review_data.keys():
            with self.subTest(removed_key):
                invalid_review_data = {k: v for k, v in review_data.items()
                                       if k != removed_key}

                res = self.app.post('/api/review/submit',
                                    json=invalid_review_data,
                                    environ_base={'REMOTE_ADDR': '127.0.0.1'})

                self.assertEqual(res.status_code, 400)
                self.assertEqual(expected_error, res.json)

    @mock.patch('api.blueprints.review.insert_review',
                side_effect=IntegrityError)
    def test_insert_invalid_review_db_error(self, mock_insert_review):
        review_data = {
            'course': 99,
            'content': 'perceptrons! svms! neural networks! HMMs!',
            'workload': 'death by homework or teammates',
            'evaluation': 5,
        }

        expected_error = {'error': 'Invalid review'}

        res = self.app.post('/api/review/submit',
                            json=review_data,
                            environ_base={'REMOTE_ADDR': '127.0.0.1'})

        self.assertEqual(res.status_code, 400)
        self.assertEqual(expected_error, res.json)

    @mock.patch("api.blueprints.review.get_course_by_id")
    @mock.patch("api.blueprints.review.get_prof_by_id")
    def test_parse_review(self, get_prof_mock, get_course_mock):
        types = [{
            'r_type': 'course',
            'fn': get_prof_mock,
            'fn_return': {
                'professor_id': 12345,
                'uni': '12345',
                'first_name': 'John',
                'last_name': 'Doe'
            },
            'expected_review_header': {
                'profId': 12345,
                'profFirstName': 'John',
                'profLastName': 'Doe',
                'uni': '12345'
            }
        }, {
            'r_type': 'professor',
            'fn': get_course_mock,
            'fn_return': {
                'course_id': 12345,
                'name': 'testtest',
                'call_number': '12345'
            },
            'expected_review_header': {
                'courseId': 12345,
                'courseName': 'testtest',
                'courseCode': '12345'
            }
        }]
        dates = [
            {
                'submission_date': datetime.strptime('2014-01-01', '%Y-%m-%d'),
                'deprecated': True
            },
            {
                'submission_date': datetime.strptime('2019-01-01', '%Y-%m-%d'),
                'deprecated': False
            },
        ]

        review = {
            'upvotes': -1,
            'downvotes': -2,
            'funnys': -3,
            'upvote_clicked': True,
            'downvote_clicked': False,
            'funny_clicked': False,
            'review_id': 12333,
            'content': 'test content',
            'workload': 'test workload',
        }

        id = 11111
        for type_ in types:
            for date in dates:
                with self.subTest(type_=type_, date=date):
                    type_['fn'].return_value = type_['fn_return']
                    review['submission_date'] = date['submission_date']

                    res = parse_review(review, type_['r_type'], id)

                    type_['fn'].assert_called_with(id)
                    self.assertEqual(res, {
                        'reviewType': type_['r_type'],
                        'reviewHeader': type_['expected_review_header'],
                        'votes': {
                            'initUpvoteCount': review['upvotes'],
                            'initDownvoteCount': review['downvotes'],
                            'initFunnyCount': review['funnys'],
                            'upvoteClicked': review['upvote_clicked'],
                            'downvoteClicked': review['downvote_clicked'],
                            'funnyClicked': review['funny_clicked']
                        },
                        'submissionDate': review['submission_date'],
                        'workload': review['workload'],
                        'content': review['content'],
                        'reviewId': review['review_id'],
                        'deprecated': date['deprecated']
                    })

    # @mock.patch("__main__.parse_review")
    @mock.patch("api.blueprints.review.get_reviews_db")
    @mock.patch("api.blueprints.review.get_cp_id_by_course")
    @mock.patch("api.blueprints.review.get_cp_id_by_prof")
    def test_get_reviews_get_only_valid(
        self,
        cp_by_prof_mock,
        cp_by_course_mock,
        get_reviews_db_mock,
    ):
        cases = [{
            'type': 'course',
            'fn': cp_by_course_mock,
            'fn_return': [{
                'course_professor_id': 6,
                'professor_id': 3
            }],
            'cp_ids': [6]
        }, {
            'type': 'professor',
            'fn': cp_by_prof_mock,
            'fn_return': [{
                'course_professor_id': 5,
                'course_id': 4
            }, {
                'course_professor_id': 6,
                'course_id': 3
            }],
            'cp_ids': [5, 6]
        }]
        id, ip = 3, "123.456.78.910"

        for case in cases:
            with self.subTest(case=case):
                r_type = case['type']
                case['fn'].return_value = case['fn_return']
                get_reviews_db_mock.return_value = [
                    mock.Mock() for _ in case['fn_return']
                ]

                self.app.get(
                    f'/api/review/get?type={r_type}&{r_type}Id={id}',
                    environ_base={'REMOTE_ADDR': ip}
                )

                case['fn'].assert_called_with(id, None)
                get_reviews_db_mock.assert_called_with(
                    case['cp_ids'],
                    ip,
                    'submission_date',
                    True,
                    None
                )

                '''
                temporarily commented out until a way to patch a function
                defined in the same module as the tested function
                is found
                '''
                # o_type = 'professor' if r_type == 'course' else 'course'
                # calls = [mock.call(
                #     mock.ANY,
                #     r_type,
                #     x[f'{o_type}_id']
                # ) for x in case['fn_return']]
                # parse_review_mock.assert_has_calls(calls)
                # parse_review_mock.assert_called()

    @mock.patch("api.blueprints.review.get_reviews_db")
    @mock.patch("api.blueprints.review.get_cp_id_by_course")
    @mock.patch("api.blueprints.review.get_cp_id_by_prof")
    def test_get_reviews_get_only_invalid(
        self,
        cp_by_prof_mock,
        cp_by_course_mock,
        get_reviews_db_mock,
    ):
        res = self.app.get(
            f'/api/review/get?type=invalid_type&invalidId={id}',
            environ_base={'REMOTE_ADDR': "123.456.78.910"}
        )
        self.assertEqual(res.status_code, 400)
        self.assertEqual(res.json, {"error": "invalid page type"})

        cp_by_prof_mock.assert_not_called()
        cp_by_course_mock.assert_not_called()
        get_reviews_db_mock.assert_not_called()

    @mock.patch("api.blueprints.review.get_reviews_db")
    @mock.patch("api.blueprints.review.get_cp_id_by_course")
    @mock.patch("api.blueprints.review.get_cp_id_by_prof")
    def test_get_reviews_full_valid(
        self,
        cp_by_prof_mock,
        cp_by_course_mock,
        get_reviews_db_mock,
    ):
        '''
        tests if the pipeline is passing on the right args.
        note that the specific filtering and sorting functionality
        is tested along with get_reviews_db, not here
        '''
        sorting_spec = {
            'best': ['rating', True],
            'worst': ['rating', False],
            'newest': ['submission_date', True],
            'oldest': ['submission_date', False],
            'most agreed': ['upvotes', True],
            'most disagreed': ['downvotes', True]
        }

        cases = [{
            'type': 'course',
            'fn': cp_by_course_mock,
            'fn_return': [{
                'course_professor_id': 6,
                'professor_id': 3
            }],
            'cp_ids': [6],
            'filter_list': [3]
        }, {
            'type': 'professor',
            'fn': cp_by_prof_mock,
            'fn_return': [{
                'course_professor_id': 5,
                'course_id': 4
            }, {
                'course_professor_id': 6,
                'course_id': 3
            }],
            'cp_ids': [5, 6],
            'filter_list': [4]
        }]
        id, ip = 3, "123.456.78.910"
        filter_year = 2

        for case in cases:
            for sorting in sorting_spec:
                with self.subTest(case=case, sorting=sorting):
                    r_type = case['type']
                    case['fn'].return_value = case['fn_return']

                    res = self.app.post(
                        f'/api/review/get?type={r_type}&{r_type}Id={id}',
                        environ_base={'REMOTE_ADDR': ip},
                        json={
                            'sorting': sorting,
                            'filterYear': filter_year,
                            'filterList': case['filter_list']
                        }
                    )

                    self.assertEqual(res.status_code, 200)
                    case['fn'].assert_called_with(
                        id,
                        case['filter_list']
                    )
                    get_reviews_db_mock.assert_called_with(
                        case['cp_ids'],
                        ip,
                        sorting_spec[sorting][0],
                        sorting_spec[sorting][1],
                        filter_year
                    )
