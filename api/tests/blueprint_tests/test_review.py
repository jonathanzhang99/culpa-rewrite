from unittest import mock

from pymysql.err import IntegrityError

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

        res = self.client.post('/api/review/submit',
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
        review_data = {
            'course': 99,
            'content': 'perceptrons! svms! neural networks! HMMs!',
            'workload': 'death by homework or teammates',
            'evaluation': 5,
        }

        expected_error = {'error': 'Invalid data'}

        res = self.client.post('/api/review/submit',
                               json=review_data,
                               environ_base={'REMOTE_ADDR': '127.0.0.1'})

        self.assertEqual(res.status_code, 400)
        self.assertEqual(expected_error, res.json)
