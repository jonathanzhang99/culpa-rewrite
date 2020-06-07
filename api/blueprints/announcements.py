import flask

announcements_blueprint = flask.Blueprint('announcements', __name__)


@announcements_blueprint.route('/', methods=['GET', 'POST'])
def announcements():
    return {'messages': ['message from server']}
