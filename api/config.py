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

    # The default user id for all server-initiated changes
    MYSQL_SERVER_USER_ID = 1

    # Miscellaneous
    REVIEW_DEPRECATED_THRESHOLD_DAYS = 5 * 365
    DEFAULT_SORT = 'newest'


class ProductionConfig(BaseConfig):
    # Expires in a week
    TOKEN_EXPIRES_DELTA = 60 * 60 * 24 * 7
    MYSQL_DATABASE_HOST = 'db.culpa.info'
    MYSQL_DATABASE_USER = 'culpa'
    MYSQL_DATABASE_DB = 'culpa_prod_db'


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
