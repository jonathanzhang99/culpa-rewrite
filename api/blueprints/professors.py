import flask

from api.data.professors import get_all_professors

professors_blueprint = flask.Blueprint('professors_blueprint', __name__)


@professors_blueprint.route('/all', methods=['POST'])
def all_professors():
    get_all_professors()
    return {
        'professors': [
            {
                'firstName': 'Nakul',
                'lastName': 'Verma'
            }
        ]
    }
