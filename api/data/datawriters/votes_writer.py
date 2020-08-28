from pypika import MySQLQuery as Query, Criterion, Order

from api.data import db
from api.data.common import vote


def add_vote(review_id, vote_type, ip, created_at):
    cur = db.get_cursor()
    query = Query \
        .into(vote) \
        .insert(
            review_id,
            ip,
            created_at,
            vote_type) \
        .get_sql()
    cur.execute(query)


def revoke_vote(review_id, vote_type, ip, created_at=None):
    cur = db.get_cursor()
    query = Query \
        .from_(vote) \
        .delete() \
        .where(
            Criterion.all([
                vote.review_id == review_id,
                vote.type == vote_type,
                vote.ip == ip
            ])) \
        .orderby(
            vote.created_at,
            order=Order.desc) \
        .limit(1) \
        .get_sql()
    cur.execute(query)
