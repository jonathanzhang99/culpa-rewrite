from pypika import MySQLQuery as Query, Criterion

from api.data import db
from api.data.common import vote


def get_user_votes(reviewId, ip):
    cur = db.get_cursor()
    q = Query.from_(vote).select(
        vote.type
    ).where(
        Criterion.all([
            vote.review_id == reviewId,
            vote.ip == ip
        ])
    ).get_sql()

    cur.execute(q)
    return cur.fetchall()
