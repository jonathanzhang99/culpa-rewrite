import flask

search_blueprint = flask.Blueprint('searc_blueprint', __name__)


@search_blueprint.route('/', methods=['POST'])
def search():
    '''
    POST request should contain two fields:
        - searchEntity: One of ['professors', 'courses', 'all'] to
          specify the data source for our results.
        - searchValue: the query string.

    This function will access the db and retrieve query matches.
    Returns a JSON object with the results.
    '''
    # saves review and gets the id of new review
    if not flask.request.is_json:
        return {'error': 'Missing JSON in request'}, 422

    request_json = flask.request.get_json()

    search_entity = request_json.get('searchEntity', 'all')
    query = request_json.get('searchValue')

    if not query:
        return {'error': 'Please give a more substantial query'}, 400

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
        'searchEntity': search_entity,
        'query': query,
    }