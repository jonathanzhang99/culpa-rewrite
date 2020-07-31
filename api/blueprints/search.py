import flask

search_blueprint = flask.Blueprint('searc_blueprint', __name__)


@search_blueprint.route('/', methods=['GET'], strict_slashes=False)
def search():
    '''
    GET request should contain two url parameters:
        - entity: One of `['professors', 'courses', 'all']` to
          specify the data source for our results.
        - q: the query string.

    This function will access the db and retrieve query matches.
    Returns a JSON object with the results.
    '''
    url_params = flask.request.args

    search_entity = url_params.get('entity', 'all')
    query = url_params.get('q', '')

    if len(query) < 2:
        return {'error': 'Query is too insubstantial'}, 400

    # TODO: Everything below this line is strictly for testing the
    # `SearchInput` on the frontend and will be removed.
    # Do not iterate on top of this.
    results = ['test1', 'test2', 'test3']
    search_results = [{
        'title': result,
        'description': f'this is {result}',
        'content': f'this is the content for {result}'
    } for result in results]

    return {
        'searchResults': search_results,
        'entity': search_entity,
        'query': query,
    }
