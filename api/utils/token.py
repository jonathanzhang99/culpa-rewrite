import datetime
import uuid

import jwt


def create_token(username, secret, expires_delta, algorithm):
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

    encoded_token = jwt.encode(data, secret, algorithm).decode('utf-8')
    return encoded_token


def decode_token(encoded_token, secret, algorithms):
    return jwt.decode(encoded_token, secret, algorithms=algorithms)
