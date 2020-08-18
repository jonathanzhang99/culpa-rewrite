import os
import unittest

from api.app import create_app
from api.config import configs
from api.data import db
from api.utils.decorators import login_required


class BaseTest(unittest.TestCase):
    '''
    This Test Class should be used for most blueprints tests. It simply sets up
    a testing instantiation of the app and gives tests access to the
    test_client.
    '''

    def setUp(self):
        self.app = create_app(configs['testing'])
        self.client = self.app.test_client()

    def tearDown(self):
        '''
        Does nothing since the app context will shut down automatically.
        '''
        pass


class LoadersWritersBaseTest(unittest.TestCase):
    '''
    This Test Class needs to setup a local mock MySql instance in order to test
    the loaders. A MySql server (v8.X) must be running on the local machine in
    order for these tests to run. Refer to the installation instructions for
    this repository if you run into errors with MySql.
    '''
    MYSQL_DATABASE_DB = 'culpa_test'
    SCHEMA_FILE = '../data/databases/schema.sql'
    SCHEMA_PATH = os.path.join(os.path.dirname(
        os.path.abspath(__file__)), SCHEMA_FILE)

    def setUp(self):
        '''
        Creates fresh database from SQL Schema file for each test case. It is
        necessary that the Schema file always remains up to date with the
        live db.
        '''
        self.app = create_app(configs['testing'])
        self.app_ctx = self.app.app_context()

        # initialize db
        with self.app_ctx:
            conn = db.get_db()

            # Test database should not exist
            conn.cursor().execute(f'CREATE DATABASE {self.MYSQL_DATABASE_DB}')
            conn.select_db(self.MYSQL_DATABASE_DB)
            with open(self.SCHEMA_PATH, 'r') as f:
                queries = f.read().split(';')

                # remove the last item from list due to newline and EOF
                queries.pop()

                for query in queries:
                    conn.cursor().execute(query)

        # change config so that future connections use the newly created db
        self.app.config['MYSQL_DATABASE_DB'] = self.MYSQL_DATABASE_DB

        self.client = self.app.test_client()
        self.app_ctx.push()
        self.cur = db.get_cursor()

    def tearDown(self):
        '''
        Drops test database and pops flask app context
        '''
        db.get_cursor().execute(
            f'DROP DATABASE IF EXISTS {self.MYSQL_DATABASE_DB}'
        )
        self.app_ctx.pop()


class AuthBaseTest(unittest.TestCase):
    def setUp(self):
        self.app = create_app(configs['testing'])

        self.protected_url = '/protected'
        self.secret = self.app.config['SECRET_KEY']

        @self.app.route(self.protected_url, methods=['GET'])
        @login_required
        def protected():
            return {'msg': 'success!'}

        self.client = self.app.test_client()

    def tearDown(self):
        pass
