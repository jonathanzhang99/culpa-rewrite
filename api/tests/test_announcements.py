from api.tests.test_base import BaseTest


class AnnouncementsTest(BaseTest):
    def test_retrieve_all_announcements(self):
        expected_res = {'messages': ['message from server']}
        res = self.app.post('/api/announcements/all')
        self.assertEqual(expected_res, res.json)
