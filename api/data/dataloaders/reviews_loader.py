from pypika import functions as fn, \
    MySQLQuery as Query, \
    Case, \
    Criterion, \
    CustomFunction, \
    Order, \
    JoinType
from pypika.terms import AnalyticFunction

from api.data import db
from api.data.common import course, course_professor, flag, \
    professor, review, vote

DateDiff = CustomFunction('DATEDIFF', ['start_date', 'end_date'])


class RowNumber(AnalyticFunction):
    def __init__(self, **kwargs):
        super(RowNumber, self).__init__('ROW_NUMBER', **kwargs)


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


# The prepare_*_query_prefix functions are called from the flask
# server layer, and return pypika Query objects that are passed into
# get_reviews_with_query_prefix as prefixes for the main query.
# The flask layer decides which function to call based on page_type.
def prepare_professor_query_prefix(prof_id, filter_list=None):
    q = Query.from_(professor).join(course_professor).on(
        Criterion.all([
            professor.professor_id == prof_id,
            professor.professor_id == course_professor.professor_id,
        ])
    ).join(course).on(
        course.course_id == course_professor.course_id
    )
    if filter_list:
        q = q.where(course.course_id.isin(filter_list))
    return q, [
                course.course_id,
                course.call_number,
                course.name
              ]


def prepare_course_query_prefix(course_id, filter_list=None):
    q = Query.from_(course).join(course_professor).on(
        Criterion.all([
            course.course_id == course_id,
            course.course_id == course_professor.course_id,
        ])
    ).join(professor).on(
        professor.professor_id == course_professor.professor_id
    )
    if filter_list:
        q = q.where(professor.professor_id.isin(filter_list))
    return q, [
                professor.professor_id,
                professor.first_name,
                professor.last_name,
                professor.uni
              ]


def get_reviews_with_query_prefix(
    query_prefix,
    ip,
    sort_criterion=None,
    sort_order=None,
    filter_year=None,
):
    '''
    Loads all reviews and votes associated with a page, using
    the course/professor information contained in the query_prefix.
    Supports sorting by time/vote/rating and filtering by time,
    also loads the clicked state of buttons for a specific user

    params: query_prefix is returned by a call to either one of the
    prepare_*_query_prefix functions, and consists of two elements:
    the query prefix, as well as the type-specific fields for the
    review header data.
    '''
    cur = db.get_cursor()

    ordered_flags = Query.from_(flag).select(
        flag.review_id,
        flag.user_id,
        flag.type,
        RowNumber().over(flag.review_id).orderby(
            flag.created_at, order=Order.desc
        ).as_('row_num')
    )
    final_flags = Query.from_(ordered_flags).select(
        ordered_flags.review_id,
        ordered_flags.user_id,
    ).where(
        Criterion.all([
            ordered_flags.row_num == 1,
            ordered_flags.type == 'approved'
        ])
    )

    q, header_fields = query_prefix
    q = q.join(review).on(
        course_professor.course_professor_id == review.course_professor_id
    ).join(final_flags).on(
        final_flags.review_id == review.review_id,
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
            'agrees': vote_count('agree'),
            'disagrees': vote_count('disagree'),
        }

        q = q.orderby(sort_criterion_map[sort_criterion], order=order)

    if filter_year:
        q = q.where(
            DateDiff(fn.Now(), review.submission_date) <= filter_year * 365
        )

    cur.execute(q.get_sql())
    return cur.fetchall()
