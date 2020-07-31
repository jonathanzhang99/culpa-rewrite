from unittest import mock

from werkzeug.security import generate_password_hash

from api.tests import BaseTest

TEST_PASSWORD = 'taxthestudents'
MOCK_USER = [{
            'users_id': 1,
            'email': 'lcb50@columbia.edu',
            'username': 'theBigL',
            'password': generate_password_hash(TEST_PASSWORD),
            'privileges': '',
        }]


@mock.patch('api.blueprints.auth.load_user', return_value=MOCK_USER)
@mock.patch('api.blueprints.auth.create_token', return_value='test_token')
class AuthTest(BaseTest):
    def test_login_with_valid_credentials(self,
                                          mock_create_token,
                                          mock_load_user):
        request_data = {
            'username': 'theBigL',
            'password': 'taxthestudents'
        }

        expected_res = {
            'token': 'test_token'
        }

        res = self.app.post('/api/auth/login', json=request_data)
        self.assertEqual(expected_res, res.json)

    def test_login_with_invalid_credentials(self,
                                            mock_create_token,
                                            mock_load_user):
        request_data = {
            'username': 'theBigL',
            'password': 'givethemwhattheywant'
        }

        expected_res = {'error': 'Incorrect login credentials'}

        res = self.app.post('/api/auth/login', json=request_data)
        self.assertEqual(401, res.status_code)
        self.assertEqual(expected_res, res.json)

    def test_login_with_nonexistent_credentials(self,
                                                mock_create_token,
                                                mock_load_user):
        mock_load_user.return_value = []
        request_data = {
            'username': 'h@cker123',
            'password': 'downwithculpa'
        }

        expected_res = {'error': 'Incorrect login credentials'}

        res = self.app.post('/api/auth/login', json=request_data)
        self.assertEqual(401, res.status_code)
        self.assertEqual(expected_res, res.json)

    def test_login_with_missing_credentials(self,
                                            mock_create_token,
                                            mock_load_user):
        request_data = {
            'someOtherData': 'missing username and password'
        }

        expected_res = {'error': 'Missing login credentials'}

        res = self.app.post('/api/auth/login', json=request_data)
        self.assertEqual(401, res.status_code)
        self.assertEqual(expected_res, res.json)
