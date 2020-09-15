import flask

from api.data.dataloaders.courses_loader import search_course
from api.data.dataloaders.professors_loader import search_professor
from api.blueprints.professor import parse_professors

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
    isAlphabetized = url_params.get('alphabetize', False)

    if len(search_query) < 2:
        return {'error': 'Query is too insubstantial'}, 400

    professor_results = []
    if search_entity in ['professor', 'all']:
        professors = search_professor(search_query,
                                      search_limit,
                                      isAlphabetized)
        professors_json = parse_professors(professors)

        # renaming keys
        professor_results = [{
            'badges': professor['badges'],
            'childKey': f'professor-{professor["professorId"]}',
            'departments': [{
                'id': department['departmentId'],
                'name': department['departmentName'],
            } for department in professor['departments']],
            'id': professor['professorId'],
            'title': professor['firstName'] + ' ' +
            professor['lastName'],
            'type': 'professor',
        } for professor in professors_json]

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
                'name': course['department_name']
            }],
            'id': course['course_id'],
            'title': course['name'],
            'type': 'course'
        } for course in courses]

    return {
        'professorResults': professor_results,
        'courseResults': course_results
    }
