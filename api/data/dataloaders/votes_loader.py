from pypika import MySQLQuery as Query

from api.data import db
from api.data.common import vote


def get_user_votes(reviewId, ip):
    cur = db.get_cursor()
    q = Query.from_(vote).select(
        vote.type
    ).where(
        (vote.review_id == reviewId) &
        (vote.ip == ip)
    ).get_sql()

    cur.execute(q)
    return cur.fetchall()
