from pypika import functions as fn, \
    MySQLQuery as Query, \
    Criterion, \
    Order

from api.data import db
from api.data.common import badge, badge_professor, course, \
    course_professor, professor, department, department_professor, \
    Match, APPROVED, PENDING, JsonArrayAgg


def load_course_basic_info(course_id):
    cur = db.get_cursor()
    query = Query \
        .from_(course) \
        .select(
            course.course_id,
            course.name,
            course.department_id,
            course.call_number,
            department.name.as_('department_name')) \
        .inner_join(department) \
        .on(
            course.department_id == department.department_id) \
        .where(Criterion.all([
            course.course_id == course_id,
            course.status == APPROVED
        ])) \
        .get_sql()

    cur.execute(query)
    return cur.fetchall()


def load_course_professors(course_id):
    cur = db.get_cursor()
    query = Query \
        .from_(course_professor) \
        .inner_join(professor) \
        .on(
            course_professor.professor_id == professor.professor_id) \
        .inner_join(department_professor) \
        .on(
            professor.professor_id == department_professor.professor_id) \
        .inner_join(department) \
        .on(
            department_professor.department_id == department.department_id) \
        .left_join(badge_professor) \
        .on(
            professor.professor_id == badge_professor.professor_id) \
        .left_join(badge) \
        .on(
            badge_professor.badge_id == badge.badge_id) \
        .select(
            professor.professor_id,
            professor.first_name,
            professor.last_name,
            JsonArrayAgg(department.department_id).as_('department_ids'),
            JsonArrayAgg(department.name).as_('department_names'),
            JsonArrayAgg(badge.badge_id).as_('badges')) \
        .groupby(
            professor.professor_id,
            professor.first_name,
            professor.last_name) \
        .where(Criterion.all([
            course_professor.course_id == course_id,
            course_professor.status == APPROVED,
        ])) \
        .orderby(
            professor.first_name) \
        .get_sql()
    cur.execute(query)
    return cur.fetchall()


def search_course(search_query, limit=None, alphabetize=False):
    cur = db.get_cursor()

    search_params = [param + '*' for param in search_query.split()]
    search_params = ' '.join(search_params)
    match = Match(course.name,
                  course.call_number) \
        .against(search_params) \
        .as_('score')

    query = Query \
        .from_(course) \
        .join(department) \
        .on(department.department_id == course.department_id) \
        .select(
            course.course_id,
            course.name,
            course.call_number,
            department.department_id,
            department.name.as_('department_name'),
            match
        ).where(Criterion.all([
            match > 0,
            course.status == APPROVED
        ])) \
        .orderby(match, order=Order.desc) \
        .limit(limit) \

    if alphabetize:
        query = query.orderby(course.name)

    cur.execute(query.get_sql())
    return cur.fetchall()


def count_pending_courses():
    cur = db.get_cursor()
    query = Query \
        .from_(course) \
        .select(
            fn.Count(course.course_id).as_('count')
        ) \
        .where(
            course.status == PENDING
        ) \
        .get_sql()
    cur.execute(query)
    return cur.fetchone()
