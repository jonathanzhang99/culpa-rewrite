from unittest import mock
from api.tests import BaseTest


class ProfessorsTest(BaseTest):
    @mock.patch('api.data.professors_loader.get_all_professors')
    def test_retrieve_all_professors(self, mock_professors):
        mock_professors.return_value = [{
            'professors_id': 1,
            'first_name': 'Lydia',
            'last_name': 'Chilton',
        }, {
            'professors_id': 2,
            'first_name': 'Lee',
            'last_name': 'Bollinger',
        }]
        expected_res = {
            'professors': [
                {
                    'firstName': 'Lydia',
                    'lastName': 'Chilton'
                }, {
                    'firstName': 'Lee',
                    'lastName': 'Bollinger'
                }
            ]
        }

        res = self.app.post('/api/professors/all')
        self.assertEqual(expected_res, res.json)

    @mock.patch('api.data.professors_loader.get_all_professors')
    def test_retrieve_all_professors_empty(self, mock_professors):
        mock_professors.return_value = []
        expected_res = {
            'professors': []
        }

        res = self.app.post('/api/professors/all')
        self.assertEqual(expected_res, res.json)
