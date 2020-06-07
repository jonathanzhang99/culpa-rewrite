from api.tests.test_base import BaseTest


class AnnouncementsTest(BaseTest):
    def test_announcements(self):
        expected_res = {'messages': ['message from server']}
        res = self.app.post('/api/announcements/')
        self.assertEqual(expected_res, res.json)
