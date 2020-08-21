from api.data import db
from api.data.datawriters.votes_writer import add_vote, revoke_vote
from api.tests import LoadersWritersBaseTest
from api.tests.data_tests.common import setup_reviews_and_flags


class VotesWriterTest(LoadersWritersBaseTest):
    def test_add_vote(self):
        voteTypes = ['agree', 'disagree', 'funny']
        reviewId, ip, time = 1, '123456789101112', '2020-02-02'
        setup_reviews_and_flags(self.cur)
        db.commit()

        for voteType in voteTypes:
            with self.subTest(voteType):
                add_vote(reviewId, voteType, ip, time)
                self.cur.execute(
                    'SELECT review_id, ip, type '
                    f'FROM vote WHERE review_id = {reviewId} '
                    f'AND ip = "{ip}"'
                )
                self.assertEqual(self.cur.fetchone(), {
                    'review_id': reviewId,
                    'ip': ip,
                    'type': voteType
                })

                # cleanup
                self.cur.execute(
                    f'DELETE FROM vote WHERE review_id = {reviewId} '
                    f'AND ip = "{ip}"'
                )
                db.commit()

    def test_revoke_vote(self):
        voteTypes = ['agree', 'disagree', 'funny']
        reviewId, ip = 1, '123456789101112'
        setup_reviews_and_flags(self.cur)
        db.commit()

        for voteType in voteTypes:
            with self.subTest(voteType):
                self.cur.execute(
                    'INSERT INTO vote VALUES'
                    f'({reviewId}, "{ip}", NOW(), "{voteType}")'
                )
                revoke_vote(
                    reviewId,
                    voteType,
                    ip
                )

                self.assertEqual(self.cur.rowcount, 1)
                db.rollback()
