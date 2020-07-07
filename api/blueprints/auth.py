<<<<<<< HEAD
import datetime
=======
>>>>>>> [Auth Routes PART 1] Moved Tests to Separate Folder (#9)
import flask
from werkzeug.security import check_password_hash

from api.utils.token import create_token
from api.data.users_loaders import load_user


auth_blueprint = flask.Blueprint('auth_blueprint', __name__)


@auth_blueprint.route('/login', methods=['POST'])
def login():
    if not flask.request.is_json:
<<<<<<< HEAD
        return {'error': 'Missing JSON in request'}, 422
=======
        return {'error': 'Missing JSON in request'}, 400
>>>>>>> [Auth Routes PART 1] Moved Tests to Separate Folder (#9)

    request_json = flask.request.get_json()

    username = request_json.get('username')
    password = request_json.get('password')

    if not username or not password:
<<<<<<< HEAD
        return {'error': 'Missing login credentials'}, 401
=======
        return {'error': 'Missing login credentials'}, 400
>>>>>>> [Auth Routes PART 1] Moved Tests to Separate Folder (#9)

    user_data = load_user(username)

    # check if user exists and is valid
    if not user_data or not check_password_hash(user_data[0]['password'],
                                                password):
<<<<<<< HEAD
        return {'error': 'Incorrect login credentials'}, 401

    secret = flask.current_app.config['SECRET_KEY']
    expiration_seconds = flask.current_app.config['TOKEN_EXPIRES_DELTA']
    algorithm = flask.current_app.config['TOKEN_GEN_ALGORITHM']

    expires_delta = datetime.timedelta(seconds=expiration_seconds)

=======
        return {'error': 'Incorrect login credentials'}, 400

    secret = flask.current_app.config['SECRET_KEY']
    expires_delta = flask.current_app.config['TOKEN_EXPIRES_DELTA']
    algorithm = flask.current_app.config['TOKEN_GEN_ALGORITHM']

>>>>>>> [Auth Routes PART 1] Moved Tests to Separate Folder (#9)
    token = create_token(username, secret, expires_delta, algorithm)

    return {'token': token}
