class BaseConfig():

    # Authorization Options
    TOKEN_EXPIRES_DELTA = 3600
    TOKEN_GEN_ALGORITHM = 'HS256'

    # MySQL Configuration Options
    MYSQL_DATABASE_HOST = 'localhost'
    MYSQL_DATABASE_PORT = 3306
    MYSQL_DATABASE_USER = 'root'
    MYSQL_DATABASE_PASSWORD = None
    MYSQL_DATABASE_DB = 'culpa'
    MYSQL_DATABASE_SOCKET = None
    MYSQL_DATABASE_CHARSET = 'utf8'
    MYSQL_USE_UNICODE = True
    MYSQL_USE_DICTCURSOR = True

    # Miscellaneous
    REVIEW_DEPRECATED_THRESHOLD_DAYS = 5 * 365


class ProductionConfig(BaseConfig):
    pass


class DevelopmentConfig(BaseConfig):
    SECRET_KEY = 'culpa_development'
    DEBUG = True


class TestingConfig(BaseConfig):
    SECRET_KEY = 'culpa_testing'
    TESTING = True
    MYSQL_DATABASE_DB = None


configs = {
    'production': ProductionConfig,
    'development': DevelopmentConfig,
    'testing': TestingConfig
}
