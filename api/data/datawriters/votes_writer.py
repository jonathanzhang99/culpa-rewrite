from pypika import MySQLQuery as Query, functions as fn, Order

from api.data import db
from api.data.common import vote


# insert new vote row corresponding to the review id and the vote type
def add_vote(reviewId, voteType, ip):
    cur = db.get_cursor()
    q = Query.into(vote).insert(
        reviewId,
        ip,
        fn.Now(),
        voteType
    ).get_sql()

    cur.execute(q)
    db.get_db().commit()


# remove the latest vote with the vote type, the review id and the ip address
def revoke_vote(reviewId, voteType, ip):

    cur = db.get_cursor()
    # note: currently is_agreed alone is sufficient to indicate vote type;
    # might require further comparisons if the schema changes
    q = Query.from_(vote).delete().where(
        (vote.review_id == reviewId) &
        (vote.type == voteType) &
        (vote.ip == ip)
    ).orderby(
        vote.created_at,
        order=Order.desc
    ).limit(1).get_sql()

    cur.execute(q)
    db.get_db().commit()
