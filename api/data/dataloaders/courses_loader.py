from pypika import MySQLQuery as Query
from pypika import Order

from api.data import db
from api.data.common import course, course_instance, professor, \
    professor_course


def get_all_courses():
    cur = db.get_cursor()
    query = Query.from_(course) \
        .select(
            course.id,
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
            course.id,
            course.name,
            course.department_id
    ).where(
            course.id == course_id
    ).get_sql()
    cur.execute(query)
    return cur.fetchall()


def get_all_course_instances(course_id):
    cur = db.get_cursor()
    query = Query.from_(course_instance) \
        .select(
            course_instance.id,
            course_instance.year,
            course_instance.semester,
            course_instance.course_id
    ).where(
            course_instance.course_id == course_id
    ).get_sql()
    cur.execute(query)
    return cur.fetchall()


def get_recent_course_instance(course_id, num_year):
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
            course_instance.id,
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
    Get a list of professors who have taught this course by:
        1. Query course_instance table for a list of instance_id's
        2. Get all professor_id's from professor_course table
        3. Get all professor names from professor table
    '''
    course_instances = get_all_course_instances(course_id)
    course_instance_ids = [course_instance['id']
                           for course_instance in course_instances]

    if len(course_instance_ids) == 0:
        raise ValueError

    cur = db.get_cursor()
    query = Query.from_(professor) \
        .select(
            professor.id,
            professor.first_name,
            professor.last_name,
            professor_course.instance_id
    ) \
        .left_join(professor_course) \
        .on(professor.id == professor_course.professor_id) \
        .where(professor_course.instance_id.isin(course_instance_ids)) \
        .get_sql()
    cur.execute(query)
    return cur.fetchall()
