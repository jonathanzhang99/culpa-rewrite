import flask
import pymysql

from pymysql.cursors import DictCursor


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
        CURSORCLASS = DictCursor if app.config.get('MYSQL_USE_DICTCURSOR') \
            else None

        connect_args = {
            'host': app.config.get('MYSQL_DATABASE_HOST'),
            'port': app.config.get('MYSQL_DATABASE_PORT'),
            'user': app.config.get('MYSQL_DATABASE_USER'),
            'password': app.config.get('MYSQL_DATABASE_PASSWORD'),
            'database': app.config.get('MYSQL_DATABASE_DB'),
            'unix_socket': app.config.get('MYSQL_DATABASE_SOCKET'),
            'charset': app.config.get('MYSQL_DATABASE_CHARSET'),
            'use_unicode': app.config.get('MYSQL_USE_UNICODE'),
            'cursorclass': CURSORCLASS
        }

        return pymysql.connect(**connect_args)

    def get_cursor(self):
        return self.get_db().cursor()

    def get_db(self):
        if flask.g is not None:
            if 'mysqldb' not in flask.g:
                flask.g.mysqldb = self.connect()
            return flask.g.get('mysqldb')

    def commit(self):
        if flask.g is not None and 'mysqldb' in flask.g:
            flask.g.mysqldb.commit()

    def rollback(self):
        if flask.g is not None and 'mysqldb' in flask.g:
            flask.g.mysqldb.rollback()

    def teardown(self, exception):
        if flask.g is not None and 'mysqldb' in flask.g:
            flask.g.mysqldb.commit()
            flask.g.mysqldb.close()
