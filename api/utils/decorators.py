import flask

from functools import wraps

from api.utils.token import decode_token
from api.utils.exceptions import InvalidHeaderError, NoAuthorizationError


def decode_token_from_header():
    HEADER_TYPE = 'Bearer'

    auth_header = flask.request.headers.get('Authorization')
    if not auth_header:
        raise NoAuthorizationError

    header_parts = auth_header.split()
    if len(header_parts) != 2 or header_parts[0] != HEADER_TYPE:
        raise InvalidHeaderError

    _, encoded_token = header_parts

    return encoded_token


def login_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        secret = flask.current_app.config['SECRET_KEY']
        algorithm = flask.current_app.config['TOKEN_GEN_ALGORITHM']

        token = decode_token_from_header()
        token_data = decode_token(token, secret, [algorithm])

        if flask.g is not None:
            flask.g.token = token_data
        return fn(*args, **kwargs)

    return wrapper
