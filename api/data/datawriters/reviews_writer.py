import datetime
from pypika import MySQLQuery as Query

from api.data import db
from api.data.common import review


def insert_review(course_professor_id, content, workload, evaluation, ip):
    cursor = db.get_cursor()
    now = datetime.datetime.utcnow()

    query = Query \
        .into(review) \
        .columns(
            review.course_professor_id,
            review.content,
            review.workload,
            review.rating,
            review.ip,
            review.submission_date) \
        .insert(
            course_professor_id,
            content,
            workload,
            evaluation,
            ip,
            now) \
        .get_sql()

    cursor.execute(query)
    return cursor.lastrowid
