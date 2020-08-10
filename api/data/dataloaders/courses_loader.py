from pypika import MySQLQuery as Query

from api.data import db
from api.data.common import course_professor


def get_cp_id_by_course(course_id, prof_ids=None):
    '''
    loads course_professor_ids related to a specific course,
    also allowing for filtering by prof ids
    '''
    cur = db.get_cursor()
    q = Query.from_(course_professor).select(
        course_professor.course_professor_id
    ).where(
        course_professor.course_id == course_id
    )

    if prof_ids:
        q = q.where(
            course_professor.professor_id.isin(prof_ids)
        )

    cur.execute(q.get_sql())
    return cur.fetchall()
