import flask

from api.data.dataloaders.departments_loader import get_all_departments

departments_blueprint = flask.Blueprint('departments_blueprint', __name__)

@departments_blueprint.route('/all', methods=['GET'])
def all_departments():
    departments = get_all_departments()
    departments_json = [{
        'name': department['name']
    } for department in departments]

    return {'departments': departments_json}
