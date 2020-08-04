from unittest import mock
from api.tests import BaseTest
from itertools import compress


class VotesTest(BaseTest):
    @mock.patch("api.blueprints.votes.add_vote")
    @mock.patch("api.blueprints.votes.revoke_vote")
    def test_change_vote_valid(self, revoke_fn_patch, add_fn_patch):
        actions = ["add", "revoke"]
        reviewId = "12345"
        voteTypeSpecs = [{
            'voteType': "upvote",
            'is_agreed': 1,
            'is_funny': None
        }, {
            'voteType': "downvote",
            'is_agreed': 0,
            'is_funny': None
        }, {
            'voteType': "funny",
            'is_agreed': None,
            'is_funny': 1
        }]

        for action in actions:
            for voteTypeSpec in voteTypeSpecs:
                with self.subTest(
                    action=action,
                    voteTypeSpec=voteTypeSpec['voteType'],
                ):
                    res = self.app.post('/api/votes/change', json=dict(
                        action=action,
                        voteType=voteTypeSpec['voteType'],
                        reviewId=reviewId
                    ), environ_base={'REMOTE_ADDR': '127.0.0.1'})

                    self.assertEqual(res.json, {
                        "status": "success",
                        "failure_msg": None
                    })

                    if action == "add":
                        add_fn_patch.assert_called_with(
                            12345,
                            voteTypeSpec['is_agreed'],
                            voteTypeSpec['is_funny'],
                            "127.0.0.1"
                        )
                    elif action == "revoke":
                        revoke_fn_patch.assert_called_with(
                            12345,
                            voteTypeSpec['is_agreed'],
                            voteTypeSpec['is_funny'],
                            "127.0.0.1"
                        )

    @mock.patch("api.blueprints.votes.add_vote")
    @mock.patch("api.blueprints.votes.revoke_vote")
    def test_change_vote_error(self, revoke_fn_patch, add_fn_patch):
        exception_msg = "test exception"
        add_fn_patch.side_effect = Exception(exception_msg)
        revoke_fn_patch.side_effect = Exception(exception_msg)
        actions = ['add', 'revoke']

        for action in actions:
            with self.subTest(action=action):
                res = self.app.post('/api/votes/change', json=dict(
                                action=action,
                                voteType='',
                                reviewId='12345'
                            ), environ_base={'REMOTE_ADDR': '127.0.0.1'})

                self.assertEqual(res.json, {
                    "status": "failure",
                    "failure_msg": exception_msg
                })

    @mock.patch("api.blueprints.votes.get_user_votes")
    def test_get_clicked_state(self, db_fn_patch):
        db_return_vals = [
            {'is_agreed': 1, 'is_funny': None},
            {'is_agreed': 0, 'is_funny': None},
            {'is_agreed': None, 'is_funny': 1}
        ]

        for upvoteClicked in [True, False]:
            for downvoteClicked in [True, False]:
                for funnyClicked in [True, False]:
                    with self.subTest(
                        upvoteClicked=upvoteClicked,
                        downvoteClicked=downvoteClicked,
                        funnyClicked=funnyClicked
                    ):
                        db_fn_patch.return_value = list(compress(
                            db_return_vals, [
                                upvoteClicked,
                                downvoteClicked,
                                funnyClicked
                            ])
                        )

                        res = self.app.get(
                            "api/votes/get_clicked_state",
                            query_string={'reviewId': '12345'}
                        )

                        self.assertEqual(res.json, {
                            'upvoteClicked': upvoteClicked,
                            'downvoteClicked': downvoteClicked,
                            'funnyClicked': funnyClicked
                        })
