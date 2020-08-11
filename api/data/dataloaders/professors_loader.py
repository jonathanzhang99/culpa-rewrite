from pypika import MySQLQuery as Query

from api.data import db
from api.data.common import course, course_professor, professor


def get_all_professors():
    cur = db.get_cursor()
    query = Query.from_(professor) \
        .select(
            professor.professor_id,
            professor.first_name,
            professor.last_name
    ).get_sql()
    cur.execute(query)
    return cur.fetchall()


def get_professor_courses(professor_id):
    '''
    Loads all of the course data for a given professor. The courses
    will be identified by `course_professor_id` since these ids are
    unique for a given professor.
    '''
    cur = db.get_cursor()
    query = Query.from_(course) \
        .join(course_professor) \
        .on(course_professor.course_id == course.course_id) \
        .select(
            course_professor.course_professor_id,
            course.name,
            course.call_number,
        ) \
        .where(course_professor.professor_id == professor_id) \
        .get_sql()
    cur.execute(query)
    return cur.fetchall()


def get_cp_id_by_prof(prof_id, course_ids=None):
    '''
    loads course_professor_ids related to a specific prof,
    also allowing for filtering by course ids
    '''
    cur = db.get_cursor()
    q = Query.from_(course_professor).select(
        course_professor.course_professor_id
    ).where(
        course_professor.professor_id == prof_id
    )

    if course_ids:
        q = q.where(
            course_professor.course_id.isin(course_ids)
        )

    cur.execute(q.get_sql())
    return cur.fetchall()


def get_prof_by_cp_id(cp_id):
    cur = db.get_cursor()
    q = Query.from_(professor).join(course_professor).on(
        professor.professor_id == course_professor.professor_id
    ).where(
        course_professor.course_professor_id == cp_id
    ).select(
        professor.first_name,
        professor.last_name
    ).get_sql()
    cur.execute(q)

    res = cur.fetchone()
    return [res['first_name'], res['last_name']]
