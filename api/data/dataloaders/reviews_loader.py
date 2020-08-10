from pypika import functions as fn, \
    MySQLQuery as Query, \
    Case, \
    Criterion, \
    CustomFunction, \
    Order

from api.data import db
from api.data.common import review, vote

DateDiff = CustomFunction('DATEDIFF', ['start_date', 'end_date'])


def get_reviews_by_cp_id(
    course_prof_ids,
    ip,
    sort_crit=None,
    sort_desc=None,
    filter_year=None
):
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
        fn.Sum(Case().when(
            Criterion.all([
                vote.type == "agree",
                vote.ip == ip
            ]), 1
        ).else_(0)).as_('upvote_clicked'),
        fn.Sum(Case().when(
            Criterion.all([
                vote.type == "disagree",
                vote.ip == ip
            ]), 1
        ).else_(0)).as_('downvote_clicked'),
        fn.Sum(Case().when(
            Criterion.all([
                vote.type == "funny",
                vote.ip == ip
            ]), 1
        ).else_(0)).as_('funny_clicked'),
        Case().when(
            DateDiff(fn.Now(), review.submission_date) >= 5 * 365,
            True
        ).else_(False).as_('deprecated'),
    )

    if sort_crit and sort_desc:
        order = Order.desc if sort_desc else Order.asc
        crit = None
        if sort_crit == 'rating':
            crit = review.rating
        elif sort_crit == 'submission_date':
            crit = review.submission_date
        elif sort_crit == 'upvotes':
            crit = fn.Sum(Case().when(
                vote.type == "agree", 1
            ).else_(0))
        else:
            crit = fn.Sum(Case().when(
                vote.type == "disagree", 1
            ).else_(0))

        q = q.orderby(crit, order=order)

    if filter_year:
        q = q.where(
            DateDiff(fn.Now(), review.submission_date) <= filter_year * 365
        )

    cur.execute(q.get_sql())
    return cur.fetchall()
