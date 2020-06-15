import flask

review_blueprint = flask.Blueprint('review_blueprint', __name__)


@review_blueprint.route('/submit', methods=['POST'])
def submit_review():
    # saves review and gets the id of new review
    return {
        'id': 'test'
    }
