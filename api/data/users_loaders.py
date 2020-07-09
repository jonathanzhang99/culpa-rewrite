from pypika import MySQLQuery as Query

from api.data import db
from api.data.common import users


def load_user(username):
    cur = db.get_cursor()
    query = Query.from_(users).select(
        users.users_id,
        users.email,
        users.username,
        users.password,
        users.privileges
        ).where(
            users.username == username
        ).get_sql()

    cur.execute(query)
    return cur.fetchall()
