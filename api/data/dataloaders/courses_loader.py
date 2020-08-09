from pypika import MySQLQuery as Query

from api.data import db
from api.data.common import course_professor


def get_cp_id_by_course(course_id):
    cur = db.get_cursor()
    q = Query.from_(course_professor).select(
        course_professor.course_professor_id
    ).where(
        course_professor.course_id == course_id
    ).get_sql()
    cur.execute(q)

    return cur.fetchall()
