from unittest import mock

from api.tests import BaseTest


PROFESSOR_RESULTS = [
    {
        'professor_id': 1,
        'first_name': 'Nakul',
        'last_name': 'Verma',
        'uni': 'nv2274',
        'department_id': 1,
        'name': 'Computer Science',
        'score': 0.5,
    },
    {
        'professor_id': 1,
        'first_name': 'Nakul',
        'last_name': 'Verma',
        'uni': 'nv2274',
        'department_id': 2,
        'name': 'Mathematics',
        'score': 0.5,
    },
    {
        'professor_id': 2,
        'first_name': 'Lee',
        'last_name': 'Bollinger',
        'uni': 'lcb50',
        'department_id': 3,
        'name': 'Law',
        'score': 0.5,
    }
]

COURSE_RESULT = [
    {
        'course_id': 1,
        'name': 'Machine Learning',
        'call_number': 'COMS 4771',
        'department_id': 1,
        'department.name': 'Computer Science',
        'score': 0.5,
    },
    {
        'course_id': 2,
        'name': 'Advanced Machine Learning',
        'call_number': 'COMS 4778',
        'department_id': 1,
        'department.name': 'Computer Science',
        'score': 0.5,
    }
]


@mock.patch('api.blueprints.search.search_professor',
            return_value=PROFESSOR_RESULTS)
@mock.patch('api.blueprints.search.search_course', return_value=COURSE_RESULT)
class SearchTest(BaseTest):
    def test_search_all(self, mock_search_professor, mock_search_course):
        expected_results = {
            'professorResults': [
                {
                    'childKey': 'professor-1',
                    'departments': [
                        {
                            'id': 1,
                            'name': 'Computer Science'
                        },
                        {
                            'id': 2,
                            'name': 'Mathematics',
                        }
                    ],
                    'id': 1,
                    'title': 'Nakul Verma',
                    'type': 'professor',
                },
                {
                    'childKey': 'professor-2',
                    'departments': [{
                        'id': 3,
                        'name': 'Law',
                    }],
                    'id': 2,
                    'last': 'true',
                    'title': 'Lee Bollinger',
                    'type': 'professor',
                }
            ],
            'courseResults': [
                {
                    'childKey': 'course-1',
                    'departments': [{
                        'id': 1,
                        'name': 'Computer Science',
                    }],
                    'id': 1,
                    'title': 'Machine Learning',
                    'type': 'course',
                },
                {
                    'childKey': 'course-2',
                    'departments': [{
                        'id': 1,
                        'name': 'Computer Science',
                    }],
                    'id': 2,
                    'title': 'Advanced Machine Learning',
                    'type': 'course',
                }
            ]
        }

        search_results = self.client.get(
          '/api/search?entity=all&query=testSearchValue')
        self.assertEqual(expected_results, search_results.json)

    def test_search_only_professor(self,
                                   mock_search_professor,
                                   mock_search_course):
        expected_results = {
            'professorResults': [
                {
                    'childKey': 'professor-1',
                    'departments': [
                        {
                            'id': 1,
                            'name': 'Computer Science'
                        },
                        {
                            'id': 2,
                            'name': 'Mathematics',
                        }
                    ],
                    'id': 1,
                    'title': 'Nakul Verma',
                    'type': 'professor',
                },
                {
                    'childKey': 'professor-2',
                    'departments': [{
                        'id': 3,
                        'name': 'Law',
                    }],
                    'id': 2,
                    'last': 'true',
                    'title': 'Lee Bollinger',
                    'type': 'professor',
                }
            ],
            'courseResults': []
        }

        search_results = self.client.get(
          '/api/search?entity=professor&query=testSearchValue')

        self.assertEqual(expected_results, search_results.json)

    def test_search_only_course(self,
                                mock_search_professor,
                                mock_search_course):
        expected_results = {
            'professorResults': [],
            'courseResults': [
                {
                    'childKey': 'course-1',
                    'departments': [{
                        'id': 1,
                        'name': 'Computer Science',
                    }],
                    'id': 1,
                    'title': 'Machine Learning',
                    'type': 'course'
                },
                {
                    'childKey': 'course-2',
                    'departments': [{
                        'id': 1,
                        'name': 'Computer Science',
                    }],
                    'id': 2,
                    'title': 'Advanced Machine Learning',
                    'type': 'course',
                }
            ]
        }

        search_results = self.client.get(
          '/api/search?entity=course&query=testSearchValue')
        self.assertEqual(expected_results, search_results.json)

    def test_search_no_result(self, mock_search_professor, mock_search_course):
        mock_search_professor.return_value = []
        mock_search_course.return_value = []
        expected_results = {
            'professorResults': [],
            'courseResults': [],
        }

        search_results = self.client.get(
          '/api/search?entity=all&query=testSearchValue')
        self.assertEqual(expected_results, search_results.json)

    def test_search_error(self, mock_search_professor, mock_search_course):
        expected_results = {
            'error': 'Query is too insubstantial',
        }

        SHORT_SEARCH_VALUE = 'a'
        search_results = self.client.get(
          f'/api/search?entity=all&query={SHORT_SEARCH_VALUE}')
        self.assertEqual(expected_results, search_results.json)

        NO_SEARCH_VALUE = ''
        search_results = self.client.get(
          f'/api/search?entity=all&query={NO_SEARCH_VALUE}')
        self.assertEqual(expected_results, search_results.json)
