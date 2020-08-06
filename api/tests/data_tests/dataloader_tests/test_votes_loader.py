from api.data import db
from api.data.dataloaders.votes_loader import get_user_votes
from api.tests import LoadersBaseTest
from itertools import compress


class VotesLoaderTest(LoadersBaseTest):
    def test_get_user_votes(self):
        reviewId, ip = '1', '123456789101112'
        timestamp = '2020-01-01 00:00:00'
        vote_cb = [
            f"({reviewId}, '{ip}', '{timestamp}', 1, NULL)",
            f"({reviewId}, '{ip}', '{timestamp}', 0, NULL)",
            f"({reviewId}, '{ip}', '{timestamp}', NULL, 1)"
        ]
        expected_res = [{
            'review_id': int(reviewId),
            'ip': ip,
            'created_at': timestamp,
            'is_agreed': 1,
            'is_funny': None
        }, {
            'review_id': int(reviewId),
            'ip': ip,
            'created_at': timestamp,
            'is_agreed': 0,
            'is_funny': None
        }, {
            'review_id': int(reviewId),
            'ip': ip,
            'created_at': timestamp,
            'is_agreed': None,
            'is_funny': 1
        }]

        for upvoteClicked in [True, False]:
            for downvoteClicked in [True, False]:
                for funnyClicked in [True, False]:
                    if [
                        upvoteClicked, downvoteClicked, funnyClicked
                       ] == [False, False, False]:
                        continue

                    with self.subTest(
                        upvoteClicked=upvoteClicked,
                        downvoteClicked=downvoteClicked,
                        funnyClicked=funnyClicked
                    ):

                        sql = ', '.join(list(
                            compress(vote_cb, [
                                upvoteClicked,
                                downvoteClicked,
                                funnyClicked
                            ])
                        ))
                        print("===================================", sql)

                        cur = db.get_cursor()
                        cur.execute(
                            'INSERT INTO vote (review_id, ip, created_at,'
                            'is_agreed, is_funny) VALUES' + sql
                        )

                        res = get_user_votes(reviewId, ip)
                        self.assertEqual(res, list(compress(
                            expected_res, [
                                upvoteClicked,
                                downvoteClicked,
                                funnyClicked
                            ])))
