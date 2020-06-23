import flask

import api.data.professors_loader as professors_loader

professors_blueprint = flask.Blueprint('professors_blueprint', __name__)


@professors_blueprint.route('/all', methods=['POST'])
def all_professors():
    professors = professors_loader.get_all_professors()
    professors_json = [{
        'firstName': professor['first_name'],
        'lastName': professor['last_name']
    } for professor in professors]

    return {'professors': professors_json}
