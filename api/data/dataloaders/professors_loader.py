from pypika import MySQLQuery as Query, Order

from api.data import db
from api.data.common import course, course_professor, professor, Match


# TODO: This method is temporary to test search functionality
# and should be removed in the future
def get_all_professors():
    cur = db.get_cursor()
    query = Query \
        .from_(professor) \
        .select(
            professor.professor_id,
            professor.first_name,
            professor.last_name) \
        .get_sql()
    cur.execute(query)
    return cur.fetchall()


def load_professor_name(professor_id):
    cur = db.get_cursor()
    query = Query \
        .from_(professor) \
        .select(
            professor.first_name,
            professor.last_name) \
        .where(
            professor.professor_id == professor_id) \
        .get_sql()
    cur.execute(query)
    return cur.fetchall()


def load_professor_courses(professor_id):
    '''
    Loads all of the course data for a given professor. The courses
    will be identified by `course_professor_id` since these ids are
    unique for a given professor.
    '''
    cur = db.get_cursor()
    query = Query \
        .from_(course) \
        .join(course_professor) \
        .on(
            course_professor.course_id == course.course_id) \
        .select(
            course_professor.course_professor_id,
            course.name,
            course.call_number) \
        .where(
            course_professor.professor_id == professor_id) \
        .get_sql()
    cur.execute(query)
    return cur.fetchall()


def search_professor(search_query, limit=None):
    cur = db.get_cursor()

    search_params = [param + '*' for param in search_query.split()]
    search_params = ' '.join(search_params)
    match = Match(professor.first_name,
                  professor.last_name,
                  professor.uni) \
        .against(search_params) \
        .as_('score')

    query = Query \
        .from_(professor) \
        .select(
            professor.professor_id,
            professor.first_name,
            professor.last_name,
            professor.uni,
            match) \
        .where(
            match > 0) \
        .orderby(
            'score', order=Order.desc) \
        .limit(limit) \
        .get_sql()
    cur.execute(query)
    return cur.fetchall()
