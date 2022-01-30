from pypika import functions as fn, \
    MySQLQuery as Query

from api.data import db
from api.data.common import course_professor, PENDING


def count_pending_course_professor_relationships():
    cur = db.get_cursor()
    query = Query \
        .from_(course_professor) \
        .select(
          fn.Count(course_professor.course_professor_id).as_('count')
        ) \
        .where(
            course_professor.status == PENDING
        ) \
        .get_sql()
    cur.execute(query)
    return cur.fetchone()
