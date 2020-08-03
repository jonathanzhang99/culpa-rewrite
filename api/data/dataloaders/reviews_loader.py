import datetime
from pypika import MySQLQuery as Query

from api.data import db
from api.data.common import review


def insert_review(course_professor_id, content, workload, evaluation):
    cursor = db.get_cursor()
    now = datetime.datetime.utcnow()

    query = Query.into(review) \
        .columns(
            review.course_professor_id,
            review.content,
            review.workload,
            review.rating,
            review.submission_date
        ).insert(
            course_professor_id,
            content,
            workload,
            evaluation,
            now
        ).get_sql()
    print(query)
    cursor.execute(query)
    cursor.execute('SELECT * FROM review')
    print(cursor.fetchall())
    return cursor.lastrowid
