from pypika import functions as fn, \
    MySQLQuery as Query, \
    Criterion, \
    Order

from api.data import db
from api.data.common import badge, badge_professor, course, \
  course_professor, department, department_professor, professor, \
  Match, APPROVED, PENDING, JsonArrayAgg


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
        .where(
            professor.status == APPROVED) \
        .get_sql()

    cur.execute(query)
    return cur.fetchall()


# TODO: Change professor loaders to be more generic:
# Private generic functions:
#   _load_professor_by_id(professor_id, [statuses])
#   _load_professor_by_uni(professor_uni, [statuses])
#
# Public functions (e.g.):
# def load_approved_professor_by_id(professor_id):
#   return _load_professor_by_id(professor_id, APPROVED)


def load_professor_basic_info_by_id(professor_id):
    cur = db.get_cursor()
    query = Query \
        .from_(professor) \
        .left_join(badge_professor) \
        .on(badge_professor.professor_id == professor.professor_id) \
        .left_join(badge) \
        .on(badge.badge_id == badge_professor.badge_id) \
        .select(
            professor.first_name,
            professor.last_name,
            JsonArrayAgg(badge.badge_id).as_('badges')) \
        .groupby(
            professor.first_name,
            professor.last_name) \
        .where(Criterion.all([
            professor.professor_id == professor_id,
            professor.status == APPROVED
        ])) \
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
        ) \
        .where(Criterion.all([
            professor.uni == professor_uni,
            professor.status == APPROVED
        ])) \
        .get_sql()

    cur.execute(query)
    return cur.fetchall()


def load_any_status_professor_by_uni(professor_uni):
    cur = db.get_cursor()
    query = Query \
        .from_(professor) \
        .select(
            professor.professor_id,
            professor.first_name,
            professor.last_name,
            professor.uni,
            professor.status,
        ) \
        .where(professor.uni == professor_uni) \
        .get_sql()

    cur.execute(query)
    return cur.fetchone()


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
        .where(Criterion.all([
            course_professor.professor_id == professor_id,
            course_professor.status == APPROVED
        ])) \
        .orderby(
            course.name) \
        .get_sql()

    cur.execute(query)
    return cur.fetchall()


def search_professor(search_query, limit=None, alphabetize=False):
    cur = db.get_cursor()

    search_params = [param + '*' for param in search_query.split()]
    search_params = ' '.join(search_params)
    match = Match(professor.first_name,
                  professor.last_name,
                  professor.uni) \
        .against(search_params) \
        .as_('score')

    # Professor must have a department -> inner join
    # Professor may not have a badge -> left join
    query = Query \
        .from_(professor) \
        .inner_join(department_professor) \
        .on(professor.professor_id == department_professor.professor_id) \
        .inner_join(department) \
        .on(department_professor.department_id == department.department_id) \
        .left_join(badge_professor) \
        .on(professor.professor_id == badge_professor.professor_id) \
        .left_join(badge) \
        .on(badge_professor.badge_id == badge.badge_id) \
        .select(
            professor.professor_id,
            professor.first_name,
            professor.last_name,
            match,
            JsonArrayAgg(department.department_id).as_('department_ids'),
            JsonArrayAgg(department.name).as_('department_names'),
            JsonArrayAgg(badge.badge_id).as_('badges'),
        ) \
        .groupby(
            professor.professor_id,
            professor.first_name,
            professor.last_name,
            match) \
        .where(Criterion.all([
            match > 0,
            professor.status == APPROVED])) \
        .orderby(match, order=Order.desc) \
        .limit(limit) \

    if alphabetize:
        query = query.orderby(professor.first_name)

    cur.execute(query.get_sql())
    return cur.fetchall()


def count_pending_professors():
    cur = db.get_cursor()
    query = Query \
        .from_(professor) \
        .select(
          fn.Count(professor.professor_id).as_('count')
        ) \
        .where(Criterion.all([
          professor.status == PENDING
        ])) \
        .get_sql()
    cur.execute(query)
    return cur.fetchone()
