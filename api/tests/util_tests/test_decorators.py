import datetime

from api.tests import AuthBaseTest
from api.utils.token import create_token


class LoginRequiredDecoratorTest(AuthBaseTest):
    def test_valid_token(self):
        token = create_token('username', self.secret, False, 'HS256')
        headers = {'Authorization': f'Bearer {token}'}

        res = self.app.get(self.protected_url, headers=headers)

        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json, {'msg': 'success!'})

    def test_invalid_token(self):
        token = 'aaaaaa.bbbbbbb.ccccccc'
        headers = {'Authorization': f'Bearer {token}'}

        res = self.app.get(self.protected_url, headers=headers)

        self.assertEqual(res.status_code, 422)
        self.assertEqual(res.json, {'error': 'Invalid Token'})

    def test_missing_header(self):
        res = self.app.get(self.protected_url)

        self.assertEqual(res.status_code, 401)
        self.assertEqual(res.json, {'error': 'Missing Authorization Header'})

    def test_incomplete_header(self):
        headers = {'Authorization': 'Bearer'}

        res = self.app.get(self.protected_url, headers=headers)

        self.assertEqual(res.status_code, 422)
        self.assertEqual(res.json, {'error': 'Authorization Header Invalid'})

    def test_invalid_header(self):
        token = create_token('username', self.secret, False, 'HS256')
        headers = {'Authorization': f'Basic {token}'}

        res = self.app.get(self.protected_url, headers=headers)

        self.assertEqual(res.status_code, 422)
        self.assertEqual(res.json, {'error': 'Authorization Header Invalid'})

    def test_expired_token(self):
        token = create_token('username',
                             self.secret,
                             datetime.timedelta(seconds=-20),
                             'HS256')
        headers = {'Authorization': f'Bearer {token}'}

        res = self.app.get(self.protected_url, headers=headers)

        self.assertEqual(res.status_code, 401)
        self.assertEqual(res.json, {'error': 'Token has expired'})
