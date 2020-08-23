import flask

# TEMPORARY DO NOT ITERATE ON TOP OF THIS
search_blueprint = flask.Blueprint('search_blueprint', __name__)


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
    professor_results = []
    if search_entity != 'courses':
        professor_results = [
            {
                'badge': 'Bronze',  # TODO: Update to list of badge id
                'departments': [
                    {
                        'id': 1,
                        'name': 'Accounting'
                    }
                ],
                'last': 'false',
                'id': 1,
                'title': 'Amir Ziv',
                'type': 'professor',
            },
            {
                'badge': 'None',  # TODO: Update to list of badge id
                'departments': [
                    {
                        'id': 1,
                        'name': 'Accounting'
                    }
                ],
                'last': 'true',
                'id': 4,
                'title': 'Robert Stoumbos',
                'type': 'professor',
            }
        ]

    course_results = []
    if search_entity != 'professors':
        course_results = [
            {
                'title': 'User Interface Design',
                'type': 'course',
                'id': 38,
                'name': 'User Interface Design',
                'department': {
                    'id': 29,
                    'name': 'Computer Science',
                }
            },
        ]

    return {
        'professorResults': professor_results,
        'courseResults': course_results
    }
