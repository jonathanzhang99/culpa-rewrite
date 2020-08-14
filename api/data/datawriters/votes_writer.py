from pypika import MySQLQuery as Query, Criterion, Order

from api.data import db
from api.data.common import vote


# insert new vote row corresponding to the review id and the vote type
def add_vote(reviewId, voteType, ip, created_at):
    cur = db.get_cursor()
    q = Query.into(vote).insert(
        reviewId,
        ip,
        created_at,
        voteType
    ).get_sql()

    cur.execute(q)


# remove the latest vote with the vote type, the review id and the ip address
def revoke_vote(reviewId, voteType, ip, created_at=None):

    cur = db.get_cursor()
    q = Query.from_(vote).delete().where(
        Criterion.all([
            vote.review_id == reviewId,
            vote.type == voteType,
            vote.ip == ip
        ])
    ).orderby(
        vote.created_at,
        order=Order.desc
    ).limit(1).get_sql()

    cur.execute(q)
