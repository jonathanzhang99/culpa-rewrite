from pypika import MySQLQuery as Query
from pypika import Order

from api.data import db
from api.data.common import course, course_instance, professor, department


def get_all_courses():
    cur = db.get_cursor()
    query = Query.from_(course) \
        .select(
            course.course_id,
            course.name,
            course.department_id
    ).get_sql()
    cur.execute(query)
    return cur.fetchall()


def get_course(course_id):
    '''
    Query name, department_id from course table
    '''
    cur = db.get_cursor()
    query = Query.from_(course) \
        .select(
            course.course_id,
            course.name,
            course.department_id
    ).where(
            course.course_id == course_id
    ).get_sql()
    cur.execute(query)
    return cur.fetchall()


def get_department(department_id):
    cur = db.get_cursor()
    query = Query.from_(department) \
        .select(
            department.name
    ).where(
            department.department_id == department_id
    ).get_sql()
    cur.execute(query)
    return cur.fetchall()


def get_all_course_instances(course_id):
    cur = db.get_cursor()
    query = Query.from_(course_instance) \
        .select(
            course_instance.course_instance_id,
            course_instance.year,
            course_instance.semester,
            course_instance.course_id
    ).where(
            course_instance.course_id == course_id
    ).get_sql()
    cur.execute(query)
    return cur.fetchall()


def get_recent_course_instances(course_id, num_year):
    '''
    Query year, semester from the latest course_instance(s)
        Args:
            course_id (int)
            num_year (int): desired number of years in which this
                            course was taught
        Returns:
            cur.fetchall() (array of dicts): most recent num_year
                        years of the course_instances
    '''
    cur = db.get_cursor()
    query = Query.from_(course_instance) \
        .select(
            course_instance.course_instance_id,
            course_instance.year,
            course_instance.semester,
            course_instance.course_id
    ).where(
            course_instance.course_id == course_id
    ).orderby(
            course_instance.year, order=Order.desc
    ).limit(num_year).get_sql()
    cur.execute(query)
    return cur.fetchall()


def get_prof_by_course(course_id):
    '''
    List of all professors who have ever taught the course from most recent
    to oldest
    '''
    cur = db.get_cursor()
    query = Query.from_(professor) \
        .select(
            professor.professor_id,
            professor.first_name,
            professor.last_name,
            course_instance.course_instance_id,
            course_instance.year,
            course_instance.semester
    ) \
        .left_join(course_instance) \
        .on(professor.professor_id == course_instance.professor_id) \
        .where(course_instance.course_id == course_id) \
        .orderby(
            course_instance.year, order=Order.desc
    ).get_sql()
    cur.execute(query)
    return cur.fetchall()
