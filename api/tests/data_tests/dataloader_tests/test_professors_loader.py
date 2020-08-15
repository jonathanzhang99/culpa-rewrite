from api.data import db
from api.data.dataloaders.professors_loader import get_all_professors, \
    get_professor_courses, get_cp_id_by_prof, get_prof_by_id, \
    search_professor
from api.tests import LoadersWritersBaseTest
from api.tests.data_tests.common import setup_department_professor_courses


VERMA_PROFESSOR_ID = 1
BOLLINGER_PROFESSOR_ID = 2
JWL_PROFESSOR_ID = 3


class ProfessorsLoaderTest(LoadersWritersBaseTest):
    def test_load_all_professors(self):
        self.cur.execute(
            'INSERT INTO professor (first_name, last_name)'
            'VALUES ("test1", "test1")'
        )
        expected_res = [{'professor_id': 1,
                         'first_name': 'test1',
                         'last_name': 'test1'
                         }]

        res = get_all_professors()

        self.assertEqual(expected_res, res)

    def test_load_professor_courses_single_course(self):
        # retrieve Lee Bollinger's courses
        setup_department_professor_courses(self.cur)

        expected_courses = [
            {
                'course_professor_id': 7,
                'name': 'Freedom of Speech and Press',
                'call_number': 'POLS 3285'
            }
        ]

        courses = get_professor_courses(BOLLINGER_PROFESSOR_ID)
        self.assertEqual(expected_courses, courses)

    def test_load_professor_courses_multiple_courses(self):
        # retrieve Verma's courses
        setup_department_professor_courses(self.cur)

        expected_courses = [{
            'course_professor_id': 1,
            'name': 'Machine Learning',
            'call_number': 'COMS 4771'
        }, {
            'course_professor_id': 2,
            'name': 'Advanced Machine Learning',
            'call_number': 'COMS 4774'
        }, {
            'course_professor_id': 3,
            'name': 'Mathematics of Machine Learning',
            'call_number': 'MATH FAKE'
        }, {
            'course_professor_id': 4,
            'name': 'Advanced Programming',
            'call_number': 'COMS 3157'
        }]

        courses = get_professor_courses(VERMA_PROFESSOR_ID)
        self.assertEqual(expected_courses, courses)

    def test_get_cp_id_by_prof(self):
        test_cases = [
            {
                'prof_id': 1,
                'course_ids': [],
                'expected_res': [
                    {
                        'course_professor_id': 1,
                        'course_id': 1
                    },
                    {
                        'course_professor_id': 2,
                        'course_id': 2
                    },
                    {
                        'course_professor_id': 3,
                        'course_id': 6
                    },
                    {
                        'course_professor_id': 4,
                        'course_id': 4
                    },
                ]
            },
            {
                'prof_id': 1,
                'course_ids': [2, 6],
                'expected_res': [
                    {
                        'course_professor_id': 2,
                        'course_id': 2
                    },
                    {
                        'course_professor_id': 3,
                        'course_id': 6
                    },
                ]
            },
            {
                'prof_id': 3,
                'course_ids': [3],
                'expected_res': [{
                    'course_professor_id': 6,
                    'course_id': 3
                }]
            },
            {
                'prof_id': 4,
                'course_ids': [],
                'expected_res': ()
            },
            {
                'prof_id': 3,
                'course_ids': [5],
                'expected_res': ()
            },
        ]
        setup_department_professor_courses(self.cur)
        for test_case in test_cases:
            with self.subTest(test_case):
                res = get_cp_id_by_prof(
                    test_case['prof_id'],
                    test_case['course_ids']
                )
                self.assertEqual(res, test_case['expected_res'])

    def test_get_prof_by_id(self):
        setup_department_professor_courses(self.cur)
        test_cases = [
            {
                'id': 1,
                'expected_res': {
                    'professor_id': 1,
                    'uni': 'nv2274',
                    'first_name': 'Nakul',
                    'last_name': 'Verma'
                }
            },
            {
                'id': 3,
                'expected_res': {
                    'professor_id': 3,
                    'uni': 'jwl3',
                    'first_name': 'Jae W',
                    'last_name': 'Lee'
                }
            },
            {
                'id': 12345,
                'expected_res': None
            }
        ]

        for test_case in test_cases:
            with self.subTest(test_case):
                res = get_prof_by_id(test_case['id'])
                self.assertEqual(res, test_case['expected_res'])

    def test_search_professor_by_name(self):
        setup_department_professor_courses(self.cur)
        db.commit()

        results = search_professor('nakul verma')
        self.assertEqual(len(results), 1)

        # assert the data formatting is correct
        self.assertEqual(
            set(results[0].keys()),
            set([
                'first_name',
                'last_name',
                'professor_id',
                'score',
                'uni'
            ])
        )

        # The mysql relevancy ranking algorithm (TF-IDF, BM25 varaiant) should
        # all be > 0 but individual values will differ across OS.
        self.assertGreater(results[0].get('score'), 0.4)

        # We only compare `professor_id` and not the entire object because
        # score suffers from floating point precision errors which may easily
        # differ between OS/updates.
        self.assertEqual(results[0].get('professor_id'), VERMA_PROFESSOR_ID)

    def test_search_multiple_professors_by_name(self):
        setup_department_professor_courses(self.cur)
        db.commit()

        results = search_professor('lee')
        self.assertEqual(len(results), 2)
        expected_professor_ids = [BOLLINGER_PROFESSOR_ID, JWL_PROFESSOR_ID]

        for prof, expected_prof_id in zip(results, expected_professor_ids):
            self.assertGreater(prof.get('score'), 0)
            self.assertEqual(prof.get('professor_id'), expected_prof_id)

    def test_search_professor_by_uni(self):
        setup_department_professor_courses(self.cur)
        db.commit()

        results = search_professor('lcb50')

        self.assertEqual(len(results), 1)
        self.assertGreater(results[0].get('score'), 0.2)
        self.assertEqual(
            results[0].get('professor_id'), BOLLINGER_PROFESSOR_ID
        )

    def test_search_professor_with_limit(self):
        setup_department_professor_courses(self.cur)
        db.commit()

        results = search_professor('lee', limit=1)

        self.assertEqual(len(results), 1)
        self.assertGreater(results[0].get('score'), 0)
        self.assertEqual(
            results[0].get('professor_id'), BOLLINGER_PROFESSOR_ID
        )

    def test_search_professor_no_results(self):
        setup_department_professor_courses(self.cur)
        db.commit()

        results = search_professor('yannakakis', limit=1)

        self.assertEqual(len(results), 0)
