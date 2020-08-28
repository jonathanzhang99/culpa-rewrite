from werkzeug.security import generate_password_hash

from api.data.dataloaders.users_loader import load_user
from api.tests import LoadersWritersBaseTest


class UsersLoaderTest(LoadersWritersBaseTest):
    def test_load_user(self):
        password = 'taxthestudents'
        phash = generate_password_hash(password)
        self.cur.execute(
            'INSERT INTO user (email, username, password, privileges)'
            'VALUES (%s, %s, %s, %s)',
            ['lcb50@columbia.edu', 'theBigL', phash, '']
        )

        expected_res = [{
            'user_id': 1,
            'email': 'lcb50@columbia.edu',
            'username': 'theBigL',
            'password': phash,
            'privileges': ''
        }]

        res = load_user('theBigL')
        self.assertEqual(expected_res, res)

    def test_load_user_empty(self):
        res = load_user('bad username')
        self.assertEqual(res, ())
