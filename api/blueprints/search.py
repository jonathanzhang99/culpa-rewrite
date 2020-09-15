import flask

from api.data.dataloaders.courses_loader import search_course
from api.data.dataloaders.professors_loader import search_professor
from api.blueprints.course import parse_courses
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
    search_order = url_params.get('alphabetize', None)

    if len(search_query) < 2:
        return {'error': 'Query is too insubstantial'}, 400

    professor_results = []
    if search_entity in ['professor', 'all']:
        professors = search_professor(search_query, search_limit)
        professors_json = parse_professors(professors,
                                           alphabetize=search_order)

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
        courses_json = parse_courses(courses, alphabetize=search_order)

        # renaming keys
        course_results = [{
            'childKey': f'course-{course["courseId"]}',
            'departments': [{
                'id': course['departmentId'],
                'name': course['departmentName']
            }],
            'id': course['courseId'],
            'title': course['courseName'],
            'type': 'course'
        } for course in courses_json]

    return {
        'professorResults': professor_results,
        'courseResults': course_results
    }
