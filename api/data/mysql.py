import flask
import pymysql


class MySQL(object):
    def __init__(self, app=None):
        if app is not None:
            self.app = app
            self.init_app(self.app)
        else:
            self.app = None

    def init_app(self, app):
        '''
        Registers the teardown function with the current app context. Required
        to successfully close a database connection after each request
        '''
        app.teardown_request(self.teardown)

    def connect(self):
        app = flask.current_app
        connect_args = {
            'host': app.config.get('MYSQL_DATABASE_HOST'),
            'port': app.config.get('MYSQL_DATABASE_PORT'),
            'user': app.config.get('MYSQL_DATABASE_USER'),
            'password': app.config.get('MYSQL_DATABASE_PASSWORD'),
            'database': app.config.get('MYSQL_DATABASE_DB'),
            'unix_socket': app.config.get('MYSQL_DATABASE_SOCKET'),
            'charset': app.config.get('MYSQL_DATABASE_CHARSET'),
            'use_unicode': app.config.get('MYSQL_USE_UNICODE')
        }
        return pymysql.connect(**connect_args)

    def get_db(self):
        if flask.g is not None:
            if 'mysqldb' not in flask.g:
                flask.g.mysqldb = self.connect()
            return flask.g.get('mysqldb')

    def teardown(self, exception):
        if flask.g is not None and 'mysqldb' in flask.g:
            flask.g.mysqldb.close()
