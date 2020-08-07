from api.data import db
from api.data.datawriters.votes_writer import add_vote, revoke_vote
from api.tests import LoadersWritersBaseTest
from api.tests.data_tests.common import setup_reviews


class VotesWriterTest(LoadersWritersBaseTest):
    def test_add_vote(self):
        voteTypes = ['agree', 'disagree', 'funny']
        reviewId, ip = 1, '123456789101112'
        setup_reviews(db.get_cursor())
        db.commit()

        for voteType in voteTypes:
            with self.subTest(voteType):
                add_vote(reviewId, voteType, ip)
                cur = db.get_cursor()
                cur.execute(
                    'SELECT review_id, ip, type '
                    f'FROM vote WHERE review_id = {reviewId} '
                    f'AND ip = "{ip}"'
                )
                self.assertEqual(cur.fetchone(), {
                    'review_id': reviewId,
                    'ip': ip,
                    'type': voteType
                })

                # cleanup
                cur.execute(
                    f'DELETE FROM vote WHERE review_id = {reviewId} '
                    f'AND ip = "{ip}"'
                )
                db.commit()

    def test_revoke_vote(self):
        voteTypes = ['agree', 'disagree', 'funny']
        reviewId, ip = 1, '123456789101112'
        setup_reviews(db.get_cursor())
        db.commit()

        for voteType in voteTypes:
            with self.subTest(voteType):
                cur = db.get_cursor()
                cur.execute(
                    'INSERT INTO vote VALUES'
                    f'({reviewId}, "{ip}", NOW(), "{voteType}")'
                )
                revoke_vote(
                    reviewId,
                    voteType,
                    ip)

                self.assertEqual(cur.rowcount, 1)
                db.rollback()
