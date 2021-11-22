import datetime
import uuid

import jwt


def create_token(username, secret, expires_delta, algorithm):
    '''
    Creates a JWT token for user authentication in the front end.
    All arguments required.

    :param username: the username that we want to store in the token.
                     This should be a unique username returned by a
                     function in users_loaders.py.
    :param secret: A secret to be used to generate tokens. Note that
                   this function is NOT tied to an app_context since
                   secret is an input.
    :param expires_delta: A `datetime.timedelta` object that specifies
                          the time interval until the token expires. A
                          value of `False` or `None` specifies that the
                          token will never expire.
    :param algorithm: A string denoting which algorithm to use. Config
                      default uses `HS256`, a standard symmetric key
                      encryption scheme.
    '''
    uid = str(uuid.uuid4())
    now = datetime.datetime.utcnow()

    # iat: issued at
    # nbf: not before (not to be accepted before)
    # uid: unique id
    # exp: expires
    data = {
        'username': username,
        'iat': now,
        'nbf': now,
        'uid': uid,
    }

    # If expires_delta is False or None, then expiration is not set
    if expires_delta:
        data['exp'] = now + expires_delta

    encoded_token = jwt.encode(data, secret, algorithm)
    return encoded_token


def decode_token(encoded_token, secret, algorithms):
    return jwt.decode(encoded_token, secret, algorithms=algorithms)
