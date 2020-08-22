from pypika import functions as fn, \
    MySQLQuery as Query, \
    Case, \
    Criterion, \
    CustomFunction, \
    Order

from api.data import db
from api.data.common import review, vote, course_professor, course

# common queries / functions
DateDiff = CustomFunction('DATEDIFF', ['start_date', 'end_date'])


# valid vote types: agree, disagree, funny
def vote_count(vote_type):
    return fn.Sum(Case().when(
        vote.type == vote_type, 1
    ).else_(0)).as_(f'{vote_type}s')


def vote_clicked(vote_type, ip):
    return fn.Sum(Case().when(
        Criterion.all([
            vote.type == vote_type,
            vote.ip == ip
        ]), 1
    ).else_(0)).as_(f'{vote_type}_clicked')


def get_course_review_summary(course_id, ip):
    '''
    Get two reviews:
        1. the highest rated review with the most agreed votes (most positive)
        2. the lowest rated review with the most agreed votes (most negative)

    NOTE: Only selects reviews with at least one vote
    NOTE: Uses subquery of subquery instead of joining because
          the global max/min rating of review table can differ
          from the max/min of the reviews we are fetching.
    '''
    cur = db.get_cursor()

    # Subqueries
    review_ids = Query.from_(review).select(
        review.review_id
    ).join(course_professor).on(
        review.course_professor_id == course_professor.course_professor_id
    ).join(course).on(
        course_professor.course_id == course.course_id
    ).where(
        course.course_id == course_id
    )
    max_rating = Query.from_(review).select(
        fn.Max(review.rating)
    ).where(
        review.review_id.isin(review_ids)
    )
    min_rating = Query.from_(review).select(
        fn.Min(review.rating)
    ).where(
        review.review_id.isin(review_ids)
    )

    q = Query.from_(review).select(
        review.course_professor_id,
        review.review_id,
        review.content,
        review.workload,
        review.rating,
        review.submission_date,
        vote_count('agree'),  # agrees
        vote_count('disagree'),  # disagrees
        vote_count('funny'),  # funnys
        vote_clicked('agree', ip),  # agree_clicked
        vote_clicked('disagree', ip),  # disagree_clicked
        vote_clicked('funny', ip)  # funny_clicked
    ).inner_join(vote).on(
        review.review_id == vote.review_id
    ).where(
        (review.review_id.isin(review_ids)) &
        (review.rating == max_rating) |
        (review.rating == min_rating)
    ).groupby(
        review.course_professor_id,
        review.review_id,
        review.content,
        review.workload,
        review.rating,
        review.submission_date
    ).orderby('agrees', order=Order.desc).limit(2).get_sql()
    q = q.replace('`review`.`agrees`', '`agrees`')

    cur.execute(q)
    return cur.fetchall()
