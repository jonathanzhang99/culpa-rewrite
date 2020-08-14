from unittest import mock

from pymysql.err import IntegrityError

from api.tests import BaseTest


class VoteTest(BaseTest):
    @mock.patch("api.blueprints.vote.add_vote")
    @mock.patch("api.blueprints.vote.revoke_vote")
    def test_change_vote_valid(self, revoke_fn_patch, add_fn_patch):
        actionMap = {'add': add_fn_patch, 'revoke': revoke_fn_patch}
        reviewId = "12345"
        voteTypes = ["agree", "disagree", "funny"]

        for action in actionMap:
            for voteType in voteTypes:
                with self.subTest(
                    action=action,
                    voteType=voteType,
                ):
                    res = self.app.post('/api/vote/change', json=dict(
                        action=action,
                        voteType=voteType,
                        reviewId=reviewId
                    ), environ_base={'REMOTE_ADDR': '127.0.0.1'})

                    self.assertEqual(res.status_code, 200)

                    actionMap[action].assert_called_with(
                        12345,
                        voteType,
                        "127.0.0.1",
                        mock.ANY
                    )

    @mock.patch("api.blueprints.vote.add_vote")
    @mock.patch("api.blueprints.vote.revoke_vote")
    def test_change_vote_error(self, revoke_fn_patch, add_fn_patch):
        add_fn_patch.side_effect = IntegrityError
        revoke_fn_patch.side_effect = IntegrityError
        actions = ['add', 'revoke']

        for action in actions:
            with self.subTest(action=action):
                res = self.app.post('/api/vote/change', json=dict(
                                action=action,
                                voteType='agree',
                                reviewId='12345'
                            ), environ_base={'REMOTE_ADDR': '127.0.0.1'})

                self.assertEqual(res.json, {"error": 'Invalid data'})
                self.assertEqual(res.status_code, 400)
