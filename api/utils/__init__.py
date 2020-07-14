import jwt

from api.utils.exceptions import InvalidHeaderError, NoAuthorizationError


def register_auth_error_handlers(app):
    @app.errorhandler(jwt.ExpiredSignatureError)
    def handle_expired_signature(e):
        return {'error': 'Token has expired'}, 401

    @app.errorhandler(jwt.InvalidTokenError)
    def handle_invalid_token(e):
        return {'error': 'Invalid Token'}, 422

    @app.errorhandler(jwt.DecodeError)
    def handle_decode_error(e):
        return {'error': 'Invalid Token'}, 422

    @app.errorhandler(NoAuthorizationError)
    def handle_auth_error(e):
        return {'error': 'Missing Authorization Header'}, 401

    @app.errorhandler(InvalidHeaderError)
    def handle_header_error(e):
        return {'error': 'Authorization Header Invalid'}, 422
