from pypika import MySQLQuery as Query, Order

from api.data import db
from api.data.common import course, course_professor, department, \
  department_professor, professor, Match


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


def load_professor_basic_info_by_id(professor_id):
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


def load_professor_basic_info_by_uni(professor_uni):
    cur = db.get_cursor()
    query = Query \
        .from_(professor) \
        .select(
            professor.professor_id,
            professor.first_name,
            professor.last_name,
            professor.uni,
        ).where(
            professor.uni == professor_uni
        ).get_sql()
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
            course.course_id,
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

    # This subquery guarantees limit == number of distinct professors
    # otherwise, limit == number of rows != number of distinct professors
    distinct_professor = Query \
        .from_(professor) \
        .select(
            'professor_id',
            'first_name',
            'last_name',
            'uni',
            match
        ) \
        .where(match > 0) \
        .orderby('score', order=Order.desc) \
        .limit(limit) \
        .as_('distinct_professor')

    query = Query \
        .from_(distinct_professor) \
        .join(department_professor) \
        .on(department_professor.professor_id ==
            distinct_professor.professor_id) \
        .join(department) \
        .on(department.department_id == department_professor.department_id) \
        .select(
            distinct_professor.professor_id,
            distinct_professor.first_name,
            distinct_professor.last_name,
            distinct_professor.uni,
            distinct_professor.score,
            department.department_id,
            department.name,
        ) \
        .get_sql()
    cur.execute(query)
    return cur.fetchall()
