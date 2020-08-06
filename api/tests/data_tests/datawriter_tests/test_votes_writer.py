# from api.data import db
# from api.data.datawriters.votes_writer import add_vote, revoke_vote
# from api.tests import LoadersBaseTest


# class VotesWriterTest(LoadersBaseTest):
#     def test_add_vote(self):
#         cbs = [[1, None], [0, None], [None, 1]]
#         reviewId, ip = 12345, '123456789101112'

#         for cb in cbs:
#             with self.subTest(cb=cb):
#                 add_vote(reviewId, cb[0], cb[1], ip)
#                 cur = db.get_cursor()
#                 cur.execute(
#                     'SELECT review_id, ip, is_agreed, is_funny'
#                     f'FROM vote WHERE review_id = {reviewId}'
#                     f'AND ip = "{ip}"'
#                 )
#                 self.assertEqual(cur.fetchone(), {
#                     'review_id': reviewId,
#                     'ip': ip,
#                     'is_agreed': cb[0],
#                     'is_funny': cb[1]
#                 })

#                 # cleanup
#                 cur.execute(
#                     f'DELETE FROM vote WHERE review_id = {reviewId}'
#                     f'AND ip = "{ip}"'
#                 )
#                 db.get_db().commit()

#     def test_revoke_vote(self):
#         cbs = [[1, 'NULL'], [0, 'NULL'], ['NULL', 1]]
#         reviewId, ip = 12345, '123456789101112'

#         for cb in cbs:
#             with self.subTest(cb=cb):
#                 cur = db.get_cursor()
#                 cur.execute(
#                     'INSERT INTO vote VALUES'
#                     f'({reviewId}, "{ip}", NOW(), {cb[0]}, {cb[1]})'
#                 )
#                 revoke_vote(
#                     reviewId,
#                     None if cb[0] == 'NULL' else cb[0],
#                     None if cb[1] == 'NULL' else cb[1],
#                     ip)

#                 self.assertEqual(cur.rowcount, 1)
