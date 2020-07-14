import datetime
from unittest import mock

from api.tests import BaseTest
from api.utils.token import create_token, decode_token


NOW = datetime.datetime.utcnow()


class AuthTokenTest(BaseTest):
    @mock.patch('api.utils.token.datetime')
    @mock.patch('api.utils.token.uuid')
    def test_token_creation_and_decode(self, mock_uuid, mock_datetime):
        mock_datetime.datetime.utcnow.return_value = NOW
        mock_uuid.uuid4.return_value = 'unique_id'

        encoded_token = create_token(
            'test_username',
            'secret_key',
            False,
            'HS256'
        )

        decoded_token = decode_token(encoded_token, 'secret_key', ['HS256'])
        timestamp = int(NOW.replace(tzinfo=datetime.timezone.utc).timestamp())
        expected_res = {
            'username': 'test_username',
            'iat': timestamp,
            'nbf': timestamp,
            'uid': 'unique_id'
        }

        self.assertEqual(decoded_token, expected_res)
