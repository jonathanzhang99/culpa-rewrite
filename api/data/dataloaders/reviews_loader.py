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


def get_reviews_db(
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
    upvotes = fn.Sum(Case().when(
                  vote.type == "agree", 1
              ).else_(0))
    downvotes = fn.Sum(Case().when(
                    vote.type == "disagree", 1
                ).else_(0))
    funnys = fn.Sum(Case().when(
                vote.type == "funny", 1
             ).else_(0))
    upvote_clicked = fn.Sum(Case().when(
                        Criterion.all([
                            vote.type == "agree",
                            vote.ip == ip
                        ]), 1
                    ).else_(0))
    downvote_clicked = fn.Sum(Case().when(
                            Criterion.all([
                                vote.type == "disgree",
                                vote.ip == ip
                            ]), 1
                        ).else_(0))
    funny_clicked = fn.Sum(Case().when(
                        Criterion.all([
                            vote.type == "funny",
                            vote.ip == ip
                        ]), 1
                    ).else_(0))

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
        upvotes.as_('upvotes'),
        downvotes.as_('downvotes'),
        funnys.as_('funnys'),
        upvote_clicked.as_('upvote_clicked'),
        downvote_clicked.as_('downvote_clicked'),
        funny_clicked.as_('funny_clicked')
    )

    if sort_criterion and sort_order:
        order = Order.desc if sort_order == 'DESC' else Order.asc
        sort_criterion_map = {
            'rating': review.rating,
            'submission_date': review.submission_date,
            'upvotes': upvotes,
            'downvotes': downvotes,
        }

        q = q.orderby(sort_criterion_map[sort_criterion], order=order)

    if filter_year:
        q = q.where(
            DateDiff(fn.Now(), review.submission_date) <= filter_year * 365
        )

    cur.execute(q.get_sql())
    return cur.fetchall()
