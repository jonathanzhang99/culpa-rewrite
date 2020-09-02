import datetime
from pypika import MySQLQuery as Query

from api.data import db
from api.data.common import course, course_professor, department_professor, \
    professor, review


def insert_review(course_professor_id, content, workload, evaluation, ip):
    cursor = db.get_cursor()
    now = datetime.datetime.utcnow()

    query = Query \
        .into(review) \
        .columns(
            review.course_professor_id,
            review.content,
            review.workload,
            review.rating,
            review.ip,
            review.submission_date
        ) \
        .insert(
            course_professor_id,
            content,
            workload,
            evaluation,
            ip,
            now
        ) \
        .get_sql()

    # TODO(jz): Add pending flag
    cursor.execute(query)
    return cursor.lastrowid


def add_course_professor(professor_input, course_input):
    '''
    This function adds a professor and course to the database. `professor`
    and `course` can either be ids (int) or dictionaries. If an id is given,
    for either argument then the existing professor/course respectively will be
    matched to the corresponding course/professor. If a dictionary is given,
    a new entity will be created.
    '''
    cursor = db.get_cursor()

    professor_id = professor_input if type(professor_input) is int else None
    course_id = course_input if type(course_input) is int else None

    if type(professor_input) is dict:
        new_professor_query = Query \
            .into(professor) \
            .columns(
                professor.first_name,
                professor.last_name,
                professor.uni
            ) \
            .insert(
                professor_input.get('first_name'),
                professor_input.get('last_name'),
                professor_input.get('uni')
            ) \
            .get_sql()

        cursor.execute(new_professor_query)
        professor_id = cursor.lastrowid

        new_professor_department_query = Query \
            .into(department_professor) \
            .columns(
                department_professor.professor_id,
                department_professor.department_id
            ) \
            .insert(
                professor_id,
                professor_input.get('department')
            ) \
            .get_sql()

        cursor.execute(new_professor_department_query)

    if type(course_input) is dict:
        new_course_query = Query \
            .into(course) \
            .columns(
                course.name,
                course.department_id,
                course.call_number
            ) \
            .insert(
                course_input.get('name'),
                course_input.get('department'),
                course_input.get('code')
            ) \
            .get_sql()

        cursor.execute(new_course_query)
        course_id = cursor.lastrowid

    new_course_professor_query = Query \
        .into(course_professor) \
        .columns(
            course_professor.professor_id,
            course_professor.course_id
        ) \
        .insert(
            professor_id,
            course_id
        ) \
        .get_sql()

    # TODO(jz): Add flags
    cursor.execute(new_course_professor_query)
    course_professor_id = cursor.lastrowid

    return course_professor_id
