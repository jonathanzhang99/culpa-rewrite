from pypika import MySQLQuery as Query

from api.data import db
from api.data.common import course
from api.data.common import department
from api.data.common import department_professor
from api.data.common import professor


def get_all_departments():
    cur = db.get_cursor()
    query = Query.from_(department) \
        .select(
            department.department_id,
            department.name
    ).get_sql()
    cur.execute(query)
    return cur.fetchall()


def get_department_name(department_id):
    cur = db.get_cursor()
    query = Query.from_(department) \
        .select(
            department.name
        ).where(
            department.department_id == department_id
        ).get_sql()
    cur.execute(query)
    return cur.fetchall()


def get_department_courses(department_id):
    cur = db.get_cursor()
    query = Query.from_(course) \
        .select(
            course.course_id,
            course.name
        ).where(
            course.department_id == department_id
        ).get_sql()
    cur.execute(query)
    return cur.fetchall()


def get_department_professors(department_id):
    cur = db.get_cursor()
    query = Query.from_(professor) \
        .join(department_professor) \
        .on(professor.professor_id == department_professor.professor_id) \
        .select(
            professor.professor_id,
            professor.first_name,
            professor.last_name
        ).where(
            department_professor.department_id == department_id
        ).get_sql()
    cur.execute(query)
    return cur.fetchall()
