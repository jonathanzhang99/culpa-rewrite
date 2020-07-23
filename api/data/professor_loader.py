from pypika import MySQLQuery as Query

from api.data import db
from api.data.common import professor


def get_all_professors():
    cur = db.get_cursor()
    query = Query.from_(professor) \
        .select(
            professor.professor_id,
            professor.first_name,
            professor.last_name
        ).get_sql()
    cur.execute(query)
    return cur.fetchall()
