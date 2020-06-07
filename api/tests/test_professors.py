from api.tests.test_base import BaseTest


class ProfessorsTest(BaseTest):
    def test_professors(self):
        expected_res = {
            'professors': [
                {
                    'firstName': 'Nakul',
                    'lastName': 'Verma'
                }
            ]
        }
        res = self.app.post('/api/professors/')
        self.assertEqual(expected_res, res.json)
