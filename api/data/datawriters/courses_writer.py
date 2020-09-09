from pypika import MySQLQuery as Query

from api.data import db
from api.data.common import course, PENDING


def add_course(name, department, call_number):
    '''
    This function should only be called in `add_course_professor` in
    api.data.datawriters.course_professors_writer.py. The tests are
    found in the associated testing files.
    NOTE: This function does NOT check for duplicate courses.

    Returns the new course_id
    '''
    cursor = db.get_cursor()

    new_course_query = Query \
        .into(course) \
        .columns(
            course.name,
            course.department_id,
            course.call_number,
            course.status
        ) \
        .insert(
            name,
            department,
            call_number,
            PENDING
        ) \
        .get_sql()

    cursor.execute(new_course_query)
    course_id = cursor.lastrowid

    return course_id
