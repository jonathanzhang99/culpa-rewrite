from pypika import MySQLQuery as Query

from api.data import db
from api.data.common import department_professor, professor, PENDING


def add_professor(first_name, last_name, uni, department):
    '''
    This function should only be called in `add_course_professor` in
    api.data.datawriters.course_professors_writer.py. The tests are
    found in the associated testing files.
    NOTE: This function does NOT verify if UNI is a duplicate and will
    throw an Exception on broken UNIQUE constraint.

    Returns the new professor_id
    '''
    cursor = db.get_cursor()

    new_professor_query = Query \
        .into(professor) \
        .columns(
            professor.first_name,
            professor.last_name,
            professor.uni,
            professor.status
        ) \
        .insert(
            first_name,
            last_name,
            uni,
            PENDING
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
            department
        ) \
        .get_sql()

    cursor.execute(new_professor_department_query)
    return professor_id


def update_professor_status_by_id(professor_id, status):
    '''
    Updates an existing professor with the given status flag
    '''
    cursor = db.get_cursor()

    update_professor_query = Query \
        .update(professor) \
        .set(professor.status, PENDING) \
        .where(professor.professor_id == professor_id) \
        .get_sql()

    cursor.execute(update_professor_query)
    return professor_id
