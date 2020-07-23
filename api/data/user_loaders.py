from pypika import MySQLQuery as Query

from api.data import db
from api.data.common import user


def load_user(username):
    cur = db.get_cursor()
    query = Query.from_(user).select(
        user.id,
        user.email,
        user.username,
        user.password,
        user.privileges
        ).where(
            user.username == username
        ).get_sql()

    cur.execute(query)
    return cur.fetchall()
