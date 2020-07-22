from pypika import MySQLQuery as Query

from api.data import db
from api.data.common import departments


def get_all_departments():
    cur = db.get_cursor()
    query = Query.from_(departments) \
        .select(
            departments.departments_id,
            departments.name
        ).get_sql()
    cur.execute(query)
    return cur.fetchall()
