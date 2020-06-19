class BaseConfig():

    # MySQL Configuration Options
    MYSQL_DATABASE_HOST = 'localhost'
    MYSQL_DATABASE_PORT = 3306
    MYSQL_DATABASE_USER = 'root'
    MYSQL_DATABASE_PASSWORD = None
    MYSQL_DATABASE_DB = None
    MYSQL_DATABASE_SOCKET = None
    MYSQL_DATABASE_CHARSET = 'utf8'
    MYSQL_USE_UNICODE = True


class ProductionConfig(BaseConfig):
    pass


class DevelopmentConfig(BaseConfig):
    DEBUG = True


class TestingConfig(BaseConfig):
    TESTING = True


configs = {
    'production': ProductionConfig,
    'development': DevelopmentConfig,
    'testing': TestingConfig
}
