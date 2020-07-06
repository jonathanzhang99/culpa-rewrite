import flask
from werkzeug.security import check_password_hash

from api.utils.token import create_token
from api.data.users_loaders import load_user


auth_blueprint = flask.Blueprint('auth_blueprint', __name__)


@auth_blueprint.route('/login', methods=['POST'])
def login():
    if not flask.request.is_json:
        return {'error': 'Missing JSON in request'}, 400

    request_json = flask.request.get_json()

    username = request_json.get('username')
    password = request_json.get('password')

    if not username or not password:
        return {'error': 'Missing login credentials'}, 400

    user_data = load_user(username)[0]

    if not user_data or not check_password_hash(user_data['password'],
                                                password):
        return {'error': 'Incorrect login credentials'}, 400

    secret = flask.current_app.config['SECRET_KEY']
    expires_delta = flask.current_app.config['TOKEN_EXPIRES_DELTA']
    algorithm = flask.current_app.config['TOKEN_GEN_ALGORITHM']

    token = create_token(username, secret, expires_delta, algorithm)

    return {'token': token}
