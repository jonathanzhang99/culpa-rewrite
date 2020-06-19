from api.tests.test_base import BaseTest


class ProfessorsTest(BaseTest):
    def test_retrieve_all_professors(self):
        expected_res = {
            'professors': [
                {
                    'firstName': 'Nakul',
                    'lastName': 'Verma'
                }
            ]
        }
        res = self.app.post('/api/professors/all')
        self.assertEqual(expected_res, res.json)
