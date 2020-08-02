from pypika import MySQLQuery as Query, functions as fn

from api.data import db
from api.data.common import vote


def add_vote(reviewId, isUpvote, isDownvote, isFunny, ip):
    cur = db.get_cursor()
    q = Query.into(vote).insert(reviewId, ip, fn.Now(),
                                isUpvote, isDownvote, isFunny).get_sql()
    cur.execute(q)


def revoke_vote(reviewId, isUpvote, isDownvote, isFunny, ip):
    cur = db.get_cursor()
    q = Query.from_(vote).delete().where((vote.review_id == reviewId) &
                                         (vote.is_agreed == isUpvote) &
                                         (vote.is_disagreed == isDownvote) &
                                         (vote.is_funny == isFunny) &
                                         (vote.ip == ip)).limit(1).get_sql()
    cur.execute(q)
