from pypika import MySQLQuery as Query

from api.data import db
from api.data.common import course, course_professor, professor, \
    department, department_professor


def get_course(course_id):
    '''
    Query name, department_id from course table
    '''
    cur = db.get_cursor()
    query = Query.from_(course) \
        .select(
            course.course_id,
            course.name,
            course.department_id,
            course.call_number,
            department.name.as_('department_name'),
    ) \
        .inner_join(department) \
        .on(course.department_id == department.department_id) \
        .where(course.course_id == course_id).get_sql()
    cur.execute(query)
    return cur.fetchall()


def get_prof_by_course(course_id):
    '''
    Get list of all professors who have ever taught the course
    '''
    cur = db.get_cursor()
    query = Query.from_(course_professor) \
        .select(
            course_professor.professor_id,
            professor.first_name,
            professor.last_name,
    ) \
        .inner_join(professor) \
        .on(
            course_professor.professor_id == professor.professor_id
    ) \
        .where(course_professor.course_id == course_id).get_sql()
    cur.execute(query)

    return cur.fetchall()


def get_department_by_prof(professor_ids):
    '''
    Get list of departments that professors belong to
    '''
    cur = db.get_cursor()
    query = Query.from_(professor) \
        .select(
            professor.professor_id,
            department_professor.department_id,
            department.name
    ) \
        .inner_join(department_professor) \
        .on(
            professor.professor_id == department_professor.professor_id
    ) \
        .inner_join(department) \
        .on(
            department_professor.department_id == department.department_id
    ) \
        .where(
            professor.professor_id.isin(professor_ids)
    ) \
        .get_sql()
    cur.execute(query)
    return cur.fetchall()


def get_professor_departments(course_id):
    cur = db.get_cursor()
    query = Query.from_(course_professor) \
        .select(
            professor.professor_id,
            professor.first_name,
            professor.last_name,
            department.department_id,
            department.name,
    ) \
        .inner_join(professor) \
        .on(course_professor.professor_id == professor.professor_id) \
        .inner_join(department_professor) \
        .on(professor.professor_id == department_professor.professor_id) \
        .inner_join(department) \
        .on(department_professor.department_id == department.department_id) \
        .where(course_professor.course_id == course_id).get_sql()
    cur.execute(query)
    return cur.fetchall()
