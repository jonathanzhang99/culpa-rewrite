from pypika import functions as fn, \
    MySQLQuery as Query, \
    Case, \
    Criterion, \
    CustomFunction, \
    Order, \
    JoinType

from api.data import db
from api.data.common import course, course_professor, professor, review, vote

DateDiff = CustomFunction('DATEDIFF', ['start_date', 'end_date'])
professor_header_fields = [
    professor.professor_id,
    professor.first_name,
    professor.last_name,
    professor.uni
]
course_header_fields = [
    course.course_id,
    course.call_number,
    course.name
]


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


def prepare_professor_query_prefix(id, filter_list=None):
    q = Query.from_(professor).join(course_professor).on(
        Criterion.all([
            professor.professor_id == id,
            professor.professor_id == course_professor.professor_id,
        ])
    ).join(course).on(
        course.course_id == course_professor.course_id
    )
    if filter_list:
        q = q.where(course.course_id.isin(filter_list))
    return [q, course_header_fields]


def prepare_course_query_prefix(id, filter_list=None):
    q = Query.from_(course).join(course_professor).on(
        Criterion.all([
            course.course_id == id,
            course.course_id == course_professor.course_id,
        ])
    ).join(professor).on(
        professor.professor_id == course_professor.professor_id
    )
    if filter_list:
        q = q.where(professor.professor_id.isin(filter_list))
    return [q, professor_header_fields]


def get_reviews_by_page_attr(
    query_prefix,
    ip,
    sort_criterion=None,
    sort_order=None,
    filter_year=None,
):
    '''
    loads all reviews and votes associated with a list of cp_ids,
    supports sorting by time/vote/rating and filtering by time,
    also loads the clicked state of buttons for a specific user
    '''
    cur = db.get_cursor()

    q, header_fields = query_prefix
    q = q.join(review).on(
        course_professor.course_professor_id == review.course_professor_id
    ).join(vote, JoinType.left).on(
        review.review_id == vote.review_id
    ).groupby(
        *header_fields,
        review.review_id,
        review.content,
        review.workload,
        review.rating,
        review.submission_date
    ).select(
        *header_fields,
        review.review_id,
        review.content,
        review.workload,
        review.rating,
        review.submission_date,
        vote_count('agree'),
        vote_count('disagree'),
        vote_count('funny'),
        vote_clicked('agree', ip),
        vote_clicked('disagree', ip),
        vote_clicked('funny', ip)
    )

    if sort_criterion and sort_order:
        order = Order.desc if sort_order == 'DESC' else Order.asc
        sort_criterion_map = {
            'rating': review.rating,
            'submission_date': review.submission_date,
            'upvotes': vote_count('agree'),
            'downvotes': vote_count('disagree'),
        }

        q = q.orderby(sort_criterion_map[sort_criterion], order=order)

    if filter_year:
        q = q.where(
            DateDiff(fn.Now(), review.submission_date) <= filter_year * 365
        )

    cur.execute(q.get_sql())
    return cur.fetchall()
