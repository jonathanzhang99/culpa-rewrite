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
        professors = {}          # maps professor_id to professor json
        department_ids = []      # prevents duplicate departments

        search_results = search_professor(search_query, search_limit)
        for professor in search_results:

            professor_id = professor['professor_id']
            if professor_id not in professors:
                professors[professor_id] = {
                    'badges': [],
                    'childKey': f'professor-{professor_id}',
                    'departments': [],
                    'id': professor['professor_id'],
                    'title': professor["first_name"] + ' ' +
                    professor["last_name"],
                    'type': 'professor'
                }
                professor_id_order.append(professor_id)
                department_ids = []

            department_id = professor['department_id']
            if department_id not in department_ids:
                professors[professor_id]['departments'].append({
                    'id': department_id,
                    'name': professor['name'],
                })
                department_ids.append(department_id)

            badge_id = professor['badge_id']
            if badge_id and badge_id not in professors[professor_id]['badges']:
                professors[professor_id]['badges'].append(badge_id)

        for professor_id in professor_id_order:
            professor_results.append(professors[professor_id])

    # divides professors and courses
    if professor_results:
        professor_results[-1]['last'] = 'true'

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

    return {
        'professorResults': professor_results,
        'courseResults': course_results
    }
