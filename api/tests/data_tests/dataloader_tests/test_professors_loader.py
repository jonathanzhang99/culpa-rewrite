from api.data import db
from api.data.dataloaders.professors_loader import load_professor_courses, \
    load_professor_basic_info_by_id, load_professor_basic_info_by_uni, \
    search_professor
from api.tests import LoadersWritersBaseTest
from api.tests.data_tests.common import setup_department_professor_courses


VERMA_PROFESSOR_ID = 1
BOLLINGER_PROFESSOR_ID = 2
JWL_PROFESSOR_ID = 3
BAD_PROFESSOR_ID = -1
COMPUTER_DEPARTMENT_ID = 1
LAW_DEPARTMENT_ID = 2
MATH_DEPARTMENT_ID = 3

VERMA_PROFESSOR_UNI = 'nv2274'


class ProfessorsLoaderTest(LoadersWritersBaseTest):
    # We set up tests in this file so that the mock databases are in a usable
    # state. For edge cases (e.g. empty tables, empty relationships), see
    # tests in data_tests/common.py
    def setUp(self):
        super().setUp()
        setup_department_professor_courses(self.cur)
        db.commit()

    def test_load_professor_courses_single_course(self):
        expected_courses = [{
            'course_id': 5,
            'name': 'Freedom of Speech and Press',
            'call_number': 'POLS 3285'
        }]

        courses = load_professor_courses(BOLLINGER_PROFESSOR_ID)
        self.assertEqual(expected_courses, courses)

    def test_load_professor_courses_multiple_courses(self):
        expected_courses = [{
            'course_id': 1,
            'name': 'Machine Learning',
            'call_number': 'COMS 4771'
        }, {
            'course_id': 2,
            'name': 'Advanced Machine Learning',
            'call_number': 'COMS 4774'
        }, {
            'course_id': 6,
            'name': 'Mathematics of Machine Learning',
            'call_number': 'MATH FAKE'
        }, {
            'course_id': 4,
            'name': 'Advanced Programming',
            'call_number': 'COMS 3157'
        }]

        courses = load_professor_courses(VERMA_PROFESSOR_ID)
        self.assertEqual(expected_courses, courses)

    def test_load_professor_basic_info_by_id(self):
        expected_name = [{
            'first_name': 'Nakul',
            'last_name': 'Verma'
        }]

        name = load_professor_basic_info_by_id(VERMA_PROFESSOR_ID)
        self.assertEqual(expected_name, name)

    def test_load_professor_basic_info_by_id_empty(self):
        res = load_professor_basic_info_by_id(BAD_PROFESSOR_ID)
        self.assertFalse(res)

    def test_load_professor_basic_info_by_uni(self):
        res = load_professor_basic_info_by_uni(VERMA_PROFESSOR_UNI)
        expected_professor = [{
            'professor_id': VERMA_PROFESSOR_ID,
            'first_name': 'Nakul',
            'last_name': 'Verma',
            'uni': VERMA_PROFESSOR_UNI
        }]

        self.assertEqual(expected_professor, res)

    def test_load_professor_by_bad_uni(self):
        res = load_professor_basic_info_by_uni('uni123')
        self.assertFalse(res)

    def test_search_professor_with_one_department_by_name(self):
        results = search_professor('bollinger')
        self.assertEqual(len(results), 1)

        # assert the data formatting is correct
        self.assertEqual(
            set(results[0].keys()),
            set([
                'department_id',
                'first_name',
                'last_name',
                'name',
                'professor_id',
                'score',
                'uni'
            ])
        )

        # The mysql relevancy ranking algorithm (TF-IDF, BM25 varaiant) should
        # all be > 0 but individual values will differ across OS.
        self.assertGreater(results[0].get('score'), 0)

        # We only compare `professor_id` and not the entire object because
        # score suffers from floating point precision errors which may easily
        # differ between OS/updates.
        self.assertEqual(
            results[0].get('professor_id'), BOLLINGER_PROFESSOR_ID
        )

        self.assertEqual(results[0].get('department_id'), LAW_DEPARTMENT_ID)

    def test_search_professor_with_multiple_departments_by_name(self):
        results = search_professor('verma')
        self.assertEqual(len(results), 2)  # verma is in 2 departments

        # assert the data formatting is correct
        self.assertEqual(
            set(results[0].keys()),
            set([
                'department_id',
                'first_name',
                'last_name',
                'name',
                'professor_id',
                'score',
                'uni'
            ])
        )

        for result in results:
            self.assertGreater(result.get('score'), 0)
            self.assertEqual(result.get('professor_id'), VERMA_PROFESSOR_ID)

        self.assertEqual(
            results[0].get('department_id'), COMPUTER_DEPARTMENT_ID
        )
        self.assertEqual(
            results[1].get('department_id'), MATH_DEPARTMENT_ID
        )

    def test_search_multiple_professors_by_name(self):
        results = search_professor('lee')
        self.assertEqual(len(results), 2)

        expected_professor_ids = [BOLLINGER_PROFESSOR_ID, JWL_PROFESSOR_ID]
        for prof, expected_prof_id in zip(results, expected_professor_ids):
            self.assertGreater(prof.get('score'), 0)
            self.assertEqual(prof.get('professor_id'), expected_prof_id)

        self.assertEqual(results[0].get('department_id'), LAW_DEPARTMENT_ID)
        self.assertEqual(
            results[1].get('department_id'), COMPUTER_DEPARTMENT_ID
        )

    def test_search_professor_by_uni(self):
        results = search_professor('lcb50')
        self.assertEqual(len(results), 1)
        self.assertGreater(results[0].get('score'), 0)
        self.assertEqual(
            results[0].get('professor_id'), BOLLINGER_PROFESSOR_ID
        )
        self.assertEqual(results[0].get('department_id'), LAW_DEPARTMENT_ID)

    def test_search_one_professor_with_limit(self):
        results = search_professor('lee', limit=1)
        self.assertEqual(len(results), 1)
        self.assertGreater(results[0].get('score'), 0)
        self.assertEqual(
            results[0].get('professor_id'), BOLLINGER_PROFESSOR_ID
        )
        self.assertEqual(results[0].get('department_id'), LAW_DEPARTMENT_ID)

    def test_search_multiple_professors_with_limit(self):
        results = search_professor('nakul', limit=2)

        expected_results = [
          (1, 1),  # nakul verma, computer science
          (4, 1),  # nakul burma, computer science
          (1, 3),  # nakul verma, mathematics
          (4, 3),  # nakul burma, mathematics
        ]

        # 4 departments expected
        self.assertEqual(len(results), 4)

        for i, result in enumerate(results):
            self.assertGreater(result.get('score'), 0)
            self.assertEqual(
                result.get('professor_id'), expected_results[i][0]
            )
            self.assertEqual(result.get('department_id'),
                             expected_results[i][1])

    def test_search_professor_no_results(self):
        results = search_professor('bad professor name', limit=1)
        self.assertEqual(len(results), 0)
