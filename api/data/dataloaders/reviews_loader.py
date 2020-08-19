from pypika import functions as fn, \
    MySQLQuery as Query, \
    Case, \
    Criterion, \
    CustomFunction

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


def get_most_positive_reviews(course_id, ip):
    '''
    Get reviews with the highest rating along with vote counts
    '''
    cur = db.get_cursor()

    max_rating = Query.from_(review).select(
        fn.Max(review.rating)
    )

    q = Query.from_(review).inner_join(course_professor).on(
        review.course_professor_id == course_professor.course_professor_id
    ).inner_join(course).on(
        course_professor.course_id == course.course_id
    ).inner_join(vote).on(
        review.review_id == vote.review_id
    ).where(
        Criterion.all([
            course.course_id == course_id,
            review.rating == max_rating
        ])
    ).groupby(
        review.course_professor_id,
        review.review_id,
        review.content,
        review.workload,
        review.rating,
        review.submission_date
    ).select(
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
    )

    cur.execute(q.get_sql())
    return cur.fetchall()


def get_most_negative_reviews(course_id, ip):
    '''
    Get reviews with the lowest rating along with vote counts
    '''
    cur = db.get_cursor()

    min_rating = Query.from_(review).select(
        fn.Min(review.rating)
    )

    q = Query.from_(review).inner_join(course_professor).on(
        review.course_professor_id == course_professor.course_professor_id
    ).inner_join(course).on(
        course_professor.course_id == course.course_id
    ).inner_join(vote).on(
        review.review_id == vote.review_id
    ).where(
        Criterion.all([
            course.course_id == course_id,
            review.rating == min_rating
        ])
    ).groupby(
        review.course_professor_id,
        review.review_id,
        review.content,
        review.workload,
        review.rating,
        review.submission_date
    ).select(
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
    )

    cur.execute(q.get_sql())
    return cur.fetchall()
