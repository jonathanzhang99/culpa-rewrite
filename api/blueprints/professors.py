import flask

professors_blueprint = flask.Blueprint('professors_blueprint', __name__)

@professors_blueprint.route('/', methods=['POST'])
def professors():
    return {
        'professors': [
            {
                'firstName': 'Nakul',
                'lastName': 'Verma'
            }
        ]
    }