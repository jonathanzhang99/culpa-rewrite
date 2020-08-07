from api.data import db
from api.data.dataloaders.votes_loader import get_user_votes
from api.tests import LoadersWritersBaseTest
from api.tests.data_tests.common import setup_reviews
from itertools import compress


class VotesLoaderTest(LoadersWritersBaseTest):
    def test_get_user_votes(self):
        reviewId, ip = '1', '123456789101112'
        timestamp = '2020-01-01 00:00:00'
        vote_cb = [
            (reviewId, ip, timestamp, 'agree'),
            (reviewId, ip, timestamp, 'disagree'),
            (reviewId, ip, timestamp, 'funny')
        ]
        expected_res = [
            {'type': 'agree'},
            {'type': 'disagree'},
            {'type': 'funny'}
        ]
        setup_reviews(db.get_cursor())
        db.commit()

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

                        voteList = list(compress(vote_cb, [
                                upvoteClicked,
                                downvoteClicked,
                                funnyClicked
                            ]))

                        cur = db.get_cursor()
                        cur.executemany(
                            'INSERT INTO vote'
                            '(review_id, ip, created_at, type)'
                            'VALUES (%s, %s, %s, %s)',
                            voteList
                        )

                        res = get_user_votes(reviewId, ip)
                        self.assertEqual(res, list(compress(
                            expected_res, [
                                upvoteClicked,
                                downvoteClicked,
                                funnyClicked
                            ])))
                        db.rollback()
