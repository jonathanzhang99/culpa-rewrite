from pypika import functions as fn, \
    MySQLQuery as Query, \
    Case, \
    Criterion, \
    CustomFunction, \
    Order, \
    JoinType
from pypika.terms import AnalyticFunction

from api.data import db
from api.data.common import badge, badge_professor, course, \
    course_professor, flag, professor, review, vote, union_

DateDiff = CustomFunction('DATEDIFF', ['start_date', 'end_date'])


class RowNumber(AnalyticFunction):
    def __init__(self, **kwargs):
        super(RowNumber, self).__init__('ROW_NUMBER', **kwargs)


# params: vote_type -- corresponds to the ENUM field `type` in the
#         vote table, valid values are ['agree', 'disagree', 'funny']
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
    query = Query \
        .from_(professor) \
        .join(course_professor) \
        .on(
            Criterion.all([
                professor.professor_id == prof_id,
                professor.professor_id == course_professor.professor_id
            ])) \
        .join(course) \
        .on(
            course.course_id == course_professor.course_id)
    if filter_list:
        query = query.where(course.course_id.isin(filter_list))
    return query, [
        course.course_id,
        course.call_number,
        course.name
    ]


def prepare_course_query_prefix(course_id, filter_list=None):
    query = Query \
        .from_(course) \
        .join(course_professor) \
        .on(
            Criterion.all([
                course.course_id == course_id,
                course.course_id == course_professor.course_id,
            ])) \
        .join(professor) \
        .on(
            professor.professor_id == course_professor.professor_id) \
        .left_join(badge_professor) \
        .on(
            badge_professor.professor_id == professor.professor_id) \
        .left_join(badge) \
        .on(
            badge.badge_id == badge_professor.badge_id)
    if filter_list:
        query = query.where(professor.professor_id.isin(filter_list))
    return query, [
        professor.professor_id,
        professor.first_name,
        professor.last_name,
        professor.uni,
        badge.badge_id,
    ]


def prepare_all_query_prefix():
    query = Query \
        .from_(course_professor) \
        .join(course) \
        .on(
            course.course_id == course_professor.course_id) \
        .join(professor) \
        .on(
            professor.professor_id == course_professor.professor_id)
    return query, [
        course.course_id,
        course.call_number.as_('course_call_number'),
        course.name.as_('course_name'),
        professor.professor_id.as_('prof_id'),
        professor.first_name.as_('prof_first_name'),
        professor.last_name.as_('prof_last_name'),
        professor.uni.as_('prof_uni')
    ]


def get_flags_by_type(flag_type):
    '''
    Generates the pypika subquery that fetches the review_id,
    user_id, and created_at of flags with a certain type. The
    resultant subquery can be joined with the review table on
    review_id to filter for reviews with one type of flag only.

    usage example (fetching approved reviews only):
            approved_flags = get_flags_by_type('approved')
            query = Query.from_(review).join(approved_flags).on(
                approved_flags.review_id == review.review_id
            ).select(...).get_sql()

    params: flag_type -- corresponds to the ENUM field `type` in
            the flag table, valid values are ['approved',
            'pending', 'libel', 'insufficient'].
    '''
    ordered_flags = Query \
        .from_(flag) \
        .select(
            flag.review_id,
            flag.user_id,
            flag.type,
            flag.created_at,
            RowNumber()
                .over(flag.review_id)
                .orderby(
                    flag.created_at, order=Order.desc)
            .as_('row_num'))

    final_flags = Query \
        .from_(ordered_flags) \
        .select(
            ordered_flags.review_id,
            ordered_flags.user_id,
            ordered_flags.created_at) \
        .where(
            Criterion.all([
                ordered_flags.row_num == 1,
                ordered_flags.type == flag_type
            ]))

    return final_flags


def get_reviews_with_query_prefix(
    query_prefix,
    ip,
    sort_criterion=None,
    sort_order=None,
    filter_year=None,
    flag_type="approved"
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
    target_flags = get_flags_by_type(flag_type)

    query, header_fields = query_prefix
    query = query \
        .join(review) \
        .on(
            course_professor.course_professor_id ==
            review.course_professor_id) \
        .join(target_flags) \
        .on(
            target_flags.review_id == review.review_id) \
        .join(vote, JoinType.left) \
        .on(
            review.review_id == vote.review_id) \
        .groupby(
            *header_fields,
            review.review_id,
            review.content,
            review.workload,
            review.rating,
            review.submission_date) \
        .select(
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
            vote_clicked('funny', ip))

    if sort_criterion and sort_order:
        order = Order.desc if sort_order == 'DESC' else Order.asc
        sort_criterion_map = {
            'rating': review.rating,
            'submission_date': review.submission_date,
            'agrees': vote_count('agree'),
            'disagrees': vote_count('disagree'),
        }

        query = query.orderby(sort_criterion_map[sort_criterion], order=order)

    if filter_year:
        query = query.where(
            DateDiff(fn.Now(), review.submission_date) <= filter_year * 365
        )

    cur.execute(query.get_sql())
    return cur.fetchall()


def load_review(review_id, ip):
    query, header_fields = prepare_all_query_prefix()

    query = query \
        .join(review) \
        .on(
            review.course_professor_id ==
            course_professor.course_professor_id) \
        .join(flag) \
        .on(
            Criterion.all([
                review.review_id == review_id,
                review.review_id == flag.review_id
            ])) \
        .join(vote, JoinType.left) \
        .on(
            review.review_id == vote.review_id) \
        .groupby(
            *header_fields,
            flag.type,
            flag.created_at,
            review.review_id,
            review.content,
            review.workload,
            review.rating,
            review.submission_date) \
        .select(
            *header_fields,
            flag.type.as_('flag_type'),
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
            vote_clicked('funny', ip)) \
        .orderby(
            flag.created_at, order=Order.desc) \
        .limit(1) \
        .get_sql()

    cur = db.get_cursor()
    cur.execute(query)

    return cur.fetchone()


def load_review_highlight(
    query_prefix,
    ip
):
    '''
    Get most positive/negative reviews
    - most positive review: approved review with highest rating
        and most agreed votes
    - most negative review: approved review with lowest rating
        and most agreed votes
    '''
    cur = db.get_cursor()
    approved_flags = get_flags_by_type('approved')

    associated_professor, header_fields = query_prefix
    query = associated_professor \
        .join(review) \
        .on(
            course_professor.course_professor_id ==
            review.course_professor_id) \
        .join(approved_flags) \
        .on(
            approved_flags.review_id == review.review_id) \
        .join(vote, JoinType.left) \
        .on(
            review.review_id == vote.review_id) \
        .groupby(
            *header_fields,
            review.review_id,
            review.content,
            review.workload,
            review.rating,
            review.submission_date) \
        .select(
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
            vote_clicked('funny', ip))

    positive_review_query = query \
        .orderby(
            review.rating, order=Order.desc) \
        .orderby(
            vote_count('agree'), order=Order.desc) \
        .limit(1)

    negative_review_query = query \
        .orderby(
            review.rating, order=Order.asc) \
        .orderby(
            vote_count('agree'), order=Order.desc) \
        .limit(1)

    query_final = union_(
        positive_review_query.get_sql(),
        negative_review_query.get_sql()
    )

    cur.execute(query_final)
    return cur.fetchall()
