from pypika import MySQLQuery as Query

from api.data import db
from api.data.common import department


def get_all_departments():
    cur = db.get_cursor()
    query = Query.from_(department) \
        .select(
            department.id,
            department.name
        ).get_sql()
    cur.execute(query)
    return cur.fetchall()
