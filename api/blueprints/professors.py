import flask

from api.data.professor_loader import get_all_professors

professors_blueprint = flask.Blueprint('professors_blueprint', __name__)


@professors_blueprint.route('/all', methods=['POST'])
def all_professors():
    professors = get_all_professors()
    professors_json = [{
        'firstName': professor['first_name'],
        'lastName': professor['last_name']
    } for professor in professors]

    return {'professors': professors_json}
