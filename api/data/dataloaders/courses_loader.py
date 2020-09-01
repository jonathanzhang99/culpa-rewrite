from pypika import MySQLQuery as Query, Order

from api.data import db
from api.data.common import course, course_professor, professor, \
    department, department_professor, Match


def load_course_basic_info(course_id):
    cur = db.get_cursor()
    query = Query \
        .from_(course) \
        .select(
            course.course_id,
            course.name,
            course.department_id,
            course.call_number,
            department.name.as_('department_name')) \
        .inner_join(department) \
        .on(
            course.department_id == department.department_id) \
        .where(
            course.course_id == course_id) \
        .get_sql()
    cur.execute(query)
    return cur.fetchall()


def load_course_professors(course_id):
    cur = db.get_cursor()
    query = Query \
        .from_(course_professor) \
        .select(
            professor.professor_id,
            professor.first_name,
            professor.last_name,
            department.department_id,
            department.name) \
        .inner_join(professor) \
        .on(
            course_professor.professor_id == professor.professor_id) \
        .inner_join(department_professor) \
        .on(
            professor.professor_id == department_professor.professor_id) \
        .inner_join(department) \
        .on(
            department_professor.department_id == department.department_id) \
        .where(
            course_professor.course_id == course_id) \
        .get_sql()
    cur.execute(query)
    return cur.fetchall()


def search_course(search_query, limit=None):
    cur = db.get_cursor()

    search_params = [param + '*' for param in search_query.split()]
    search_params = ' '.join(search_params)
    match = Match(course.name,
                  course.call_number) \
        .against(search_params) \
        .as_('score')

    query = Query \
        .from_(course) \
        .select(
            course.course_id,
            course.name,
            course.call_number,
            match) \
        .where(
            match > 0) \
        .orderby(
            'score', order=Order.desc) \
        .limit(limit) \
        .get_sql()

    cur.execute(query)
    return cur.fetchall()
