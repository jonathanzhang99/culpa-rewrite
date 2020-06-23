from pypika import MySQLQuery as Query

from api.data import db
from api.data.common import professors


def get_all_professors():
    cur = db.get_cursor()
    query = Query.from_(professors) \
        .select('professors_id', 'first_name', 'last_name').get_sql()
    cur.execute(query)
    return cur.fetchall()
