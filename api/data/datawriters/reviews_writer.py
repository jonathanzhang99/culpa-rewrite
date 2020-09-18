import datetime
from pypika import MySQLQuery as Query

from api.data import db
from api.data.common import flag, review, PENDING


def insert_review(course_professor_id, content, workload, evaluation, ip):
    cursor = db.get_cursor()
    now = datetime.datetime.utcnow()

    review_query = Query \
        .into(review) \
        .columns(
            review.course_professor_id,
            review.content,
            review.workload,
            review.rating,
            review.ip,
            review.submission_date
        ) \
        .insert(
            course_professor_id,
            content,
            workload,
            evaluation,
            ip,
            now
        ) \
        .get_sql()

    cursor.execute(review_query)
    review_id = cursor.lastrowid

    flag_query = Query \
        .into(flag) \
        .columns(
            flag.review_id,
            flag.user_id,
            flag.type,
            flag.created_at
        ) \
        .insert(
            review_id,
            db.get_server_user_id(),
            PENDING,
            now
        ) \
        .get_sql()

    cursor.execute(flag_query)
    return review_id
