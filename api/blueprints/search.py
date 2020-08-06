import flask

# TEMPORARY DO NOT ITERATE ON TOP OF THIS
from api.data.dataloaders.professors_loader import get_all_professors

search_blueprint = flask.Blueprint('searc_blueprint', __name__)


@search_blueprint.route('/', methods=['GET'], strict_slashes=False)
def search():
    '''
    GET request should contain two url parameters:
        - entity: One of `['professors', 'courses', 'all']` to
          specify the data source for our results.
        - query: the query string.

    This function will access the db and retrieve query matches.
    Returns a JSON object with the results.
    '''
    url_params = flask.request.args

    search_entity = url_params.get('entity', 'all')
    query = url_params.get('query', '')

    if len(query) < 2:
        return {'error': 'Query is too insubstantial'}, 400

    # TODO: Everything below this line is strictly for testing the
    # `SearchInput` on the frontend and will be removed.
    # Do not iterate on top of this.
    professors = get_all_professors()
    search_results = [{
        'title': f'{professor["first_name"]} {professor["last_name"]}',
        'description': 'TEMPORARY',
        'content': 'TEMPORARY',
        'professorId': professor["professor_id"]
    } for professor in professors]

    return {
        'searchResults': search_results,
        'entity': search_entity,
        'query': query,
    }
