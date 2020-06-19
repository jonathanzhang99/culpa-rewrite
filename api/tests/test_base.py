import unittest

from api.app import create_app
from api.config import configs


class BaseTest(unittest.TestCase):

    def setUp(self):
        app = create_app(configs['testing'])
        self.app = app.test_client()

    def tearDown(self):
        pass
