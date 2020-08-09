from pypika import functions as fn, MySQLQuery as Query, Case

from api.data import db
from api.data.common import review, vote


def get_reviews_by_cp_id(course_prof_ids):
    cur = db.get_cursor()
    q = Query.from_(review).join(vote).on(
        review.review_id == vote.review_id
    ).where(
        review.course_professor_id.isin(course_prof_ids)
    ).groupby(
        review.review_id,
        review.content,
        review.workload,
        review.rating,
        review.submission_date
    ).select(
        review.review_id,
        review.content,
        review.workload,
        review.rating,
        review.submission_date,
        fn.Sum(Case().when(
            vote.type == "agree", 1
        ).else_(0)).as_('upvotes'),
        fn.Sum(Case().when(
            vote.type == "disagree", 1
        ).else_(0)).as_('downvotes'),
        fn.Sum(Case().when(
            vote.type == "funny", 1
        ).else_(0)).as_('funnys'),
    ).get_sql()

    cur.execute(q)
    return cur.fetchall()
