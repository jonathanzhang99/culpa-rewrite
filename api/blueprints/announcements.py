import flask

announcements_blueprint = flask.Blueprint('announcements', __name__)


@announcements_blueprint.route('/all', methods=['POST'])
def all_announcements():
    return {'messages': ['message from server']}
