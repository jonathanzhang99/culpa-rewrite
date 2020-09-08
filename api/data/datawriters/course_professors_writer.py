from pypika import Criterion, MySQLQuery as Query

from api.data import db
from api.data.common import course_professor, PENDING, REJECTED
from api.data.dataloaders.professors_loader import \
    load_any_status_professor_by_uni
from api.data.datawriters.professors_writer import add_professor, \
    update_professor_status_by_id
from api.data.datawriters.courses_writer import add_course


def _add_new_course_professor(professor_id, course_id):
    cursor = db.get_cursor()

    new_course_professor_query = Query \
        .into(course_professor) \
        .columns(
            course_professor.professor_id,
            course_professor.course_id,
            course_professor.status
        ) \
        .insert(
            professor_id,
            course_id,
            PENDING
        ) \
        .get_sql()

    cursor.execute(new_course_professor_query)
    course_professor_id = cursor.lastrowid
    return course_professor_id


def _update_rejected_course_professor(course_professor_id):
    cursor = db.get_cursor()

    update_rejected_course_professor_query = Query \
        .update(course_professor) \
        .set(course_professor.status, PENDING) \
        .where(course_professor.course_professor_id == course_professor_id) \
        .get_sql()

    cursor.execute(update_rejected_course_professor_query)
    course_professor_id = cursor.lastrowid
    return course_professor_id


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

    # Before inserting a new professor, verify that the input uni does not
    # match an existing professor that is either PENDING or APPROVED. If
    # a record is found, use the existing professor_id. If a new professor
    # has previously been rejected, then also create a new record.
    if type(professor_input) is dict:
        uni = professor_input.get('uni')
        existing_professor = load_any_status_professor_by_uni(uni)

        if existing_professor:
            professor_id = existing_professor[0]['professor_id']
            if existing_professor.get('status') == REJECTED:
                update_professor_status_by_id(
                    existing_professor[0]['professor_id'],
                    PENDING
                )
        else:
            professor_id = add_professor(professor_input.get('first_name'),
                                         professor_input.get('last_name'),
                                         uni,
                                         professor_input.get('department'))

    # Courses currently do not have the integrity checks given to professors
    # since it is difficult to use the Course Code to guarantee the uniqueness
    # of a code.
    if type(course_input) is dict:
        course_id = add_course(course_input.get('name'),
                               course_input.get('department'),
                               course_input.get('code'))

    # Before inserting a new course_professor entry, verify that the unique
    # will not be broken and return the existing course_professor_id if we
    # would insert a duplicate.
    verify_unique_course_professor_query = Query \
        .from_(course_professor) \
        .select(
            course_professor.course_professor_id,
            course_professor.status) \
        .where(Criterion.all([
            course_professor.professor_id == professor_id,
            course_professor.course_id == course_id
        ])) \
        .limit(1) \
        .get_sql()

    cursor.execute(verify_unique_course_professor_query)
    course_professor_result = cursor.fetchone()

    # If an existing entry is found, we return the correspondig
    # course_professor_id and change a REJECTED status to PENDING,
    # If and only if course_professor does not exist do we insert a new record
    if course_professor_result:
        status = course_professor_result['status']
        course_professor_id = course_professor_result['course_professor_id']
        if status == REJECTED:
            _update_rejected_course_professor(course_professor_id)
    else:
        course_professor_id = _add_new_course_professor(professor_id,
                                                        course_id)

    return course_professor_id
