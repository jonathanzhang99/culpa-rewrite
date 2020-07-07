class AuthException(Exception):
    '''
    Base Exception class
    '''
    pass


class NoAuthorizationError(AuthException):
    pass


class InvalidHeaderError(AuthException):
    pass
