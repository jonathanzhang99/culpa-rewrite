import flask

from api.data.dataloaders.courses_loader import search_course
from api.data.dataloaders.professors_loader import search_professor

search_blueprint = flask.Blueprint('search_blueprint', __name__)


@search_blueprint.route('/', methods=['GET'], strict_slashes=False)
def search():
    '''
    GET request should contain two url parameters:
        - entity: One of `['professor', 'course', 'all']` to
          specify the data source for our results.
        - query: the query string.

    This function will access the db and retrieve query matches.
    Returns a JSON object with the results.
    '''
    url_params = flask.request.args

    search_entity = url_params.get('entity', 'all')
    search_query = url_params.get('query', '')
    search_limit = url_params.get('limit', None)

    if len(search_query) < 2:
        return {'error': 'Query is too insubstantial'}, 400

    professor_results = []
    if search_entity in ['professor', 'all']:
        professor_id_order = []  # preserves order of search results
        professors = {}
        search_results = search_professor(search_query, search_limit)
        for professor in search_results:
            professor_id = professor['professor_id']

            if professor_id not in professors:
                professors[professor_id] = {
                    'childKey': f'professor-{professor_id}',
                    'departments': [],
                    'id': professor['professor_id'],
                    'title': professor["first_name"] + ' ' +
                    professor["last_name"],
                    'type': 'professor'
                }
                professor_id_order.append(professor_id)

            professors[professor_id]['departments'].append({
                'id': professor['department_id'],
                'name': professor['name'],
            })

        for professor_id in professor_id_order:
            professor_results.append(professors[professor_id])

    course_results = []
    if search_entity in ['course', 'all']:
        courses = search_course(search_query, search_limit)
        course_results = [{
            'childKey': f'course-{course["course_id"]}',
            'departments': [{
                'id': course['department_id'],
                'name': course['department.name']
            }],
            'id': course['course_id'],
            'title': course['name'],
            'type': 'course'
        } for course in courses]

    # divides professors and courses
    if professor_results and course_results:
        professor_results[-1]['last'] = 'true'

    return {
        'professorResults': professor_results,
        'courseResults': course_results
    }
