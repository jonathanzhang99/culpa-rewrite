from pypika import Criterion, MySQLQuery as Query

from api.data import db
from api.data.common import badge, badge_professor, course, department, \
    department_professor, professor, APPROVED


def load_all_departments():
    cur = db.get_cursor()
    query = Query \
        .from_(department) \
        .select(
            department.department_id,
            department.name) \
        .orderby(
            department.name) \
        .get_sql()

    cur.execute(query)
    return cur.fetchall()


def load_department_name(department_id):
    cur = db.get_cursor()
    query = Query \
        .from_(department) \
        .select(
            department.name) \
        .where(
            department.department_id == department_id) \
        .get_sql()

    cur.execute(query)
    return cur.fetchall()


def load_department_courses(department_id):
    cur = db.get_cursor()
    query = Query \
        .from_(course) \
        .select(
            course.course_id,
            course.name) \
        .where(Criterion.all([
            course.department_id == department_id,
            course.status == APPROVED
        ])) \
        .orderby(
            course.name) \
        .get_sql()

    cur.execute(query)
    return cur.fetchall()


def load_department_professors(department_id):
    cur = db.get_cursor()
    query = Query \
        .from_(professor) \
        .join(department_professor) \
        .on(
            professor.professor_id == department_professor.professor_id) \
        .left_join(badge_professor) \
        .on(professor.professor_id == badge_professor.professor_id) \
        .left_join(badge) \
        .on(badge_professor.badge_id == badge.badge_id) \
        .select(
            professor.professor_id,
            professor.first_name,
            professor.last_name,
            badge.badge_id) \
        .where(Criterion.all([
            department_professor.department_id == department_id,
            professor.status == APPROVED
        ])) \
        .orderby(
            professor.first_name) \
        .get_sql()

    cur.execute(query)
    return cur.fetchall()
