from api.data import db
from api.data.dataloaders.professors_loader import load_professor_courses, \
    load_professor_basic_info_by_id, load_professor_basic_info_by_uni, \
    search_professor
from api.tests import LoadersWritersBaseTest
from api.tests.data_tests.common import setup_department_professor_courses
from collections import namedtuple


VERMA_PROFESSOR_ID = 1
VERMA_PROFESSOR_UNI = 'nv2274'
BOLLINGER_PROFESSOR_ID = 2
JWL_PROFESSOR_ID = 3
BURMA_PROFESSOR_ID = 4
BAD_PROFESSOR_ID = -1
COMPUTER_DEPARTMENT_ID = 1
LAW_DEPARTMENT_ID = 2
MATH_DEPARTMENT_ID = 3
GOLD_NUGGET_ID = 1
SILVER_NUGGET_ID = 2
BRONZE_NUGGET_ID = 3


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
            'course_id': 4,
            'name': 'Advanced Programming',
            'call_number': 'COMS 3157'
        }, {
            'course_id': 6,
            'name': 'Mathematics of Machine Learning',
            'call_number': 'MATH FAKE'
        }]

        courses = load_professor_courses(VERMA_PROFESSOR_ID)
        self.assertEqual(expected_courses, courses)

    def test_load_professor_basic_info_by_id(self):
        expected_results = [{
            'first_name': 'Nakul',
            'last_name': 'Verma',
            'badge_id': 1,
        }, {
            'first_name': 'Nakul',
            'last_name': 'Verma',
            'badge_id': 2,
        }]

        results = load_professor_basic_info_by_id(VERMA_PROFESSOR_ID)
        self.assertEqual(expected_results, results)

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
                'professor_id',
                'first_name',
                'last_name',
                'uni',
                'score',
                'department_id',
                'name',
                'badge_id',
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

        self.assertEqual(results[0].get('badge_id'), BRONZE_NUGGET_ID)

    def test_search_professor_with_multiple_departments_by_name(self):
        Professor = namedtuple('Professor',
                               ['professor_id',
                                'department_id',
                                'badge_id'])

        results = search_professor('verma')
        self.assertEqual(len(results), 4)  # 2 departments X 2 badges

        # assert the data formatting is correct
        self.assertEqual(
            set(results[0].keys()),
            set([
                'professor_id',
                'first_name',
                'last_name',
                'uni',
                'score',
                'department_id',
                'name',
                'badge_id',
            ])
        )

        expected_results = [
            Professor(VERMA_PROFESSOR_ID,
                      COMPUTER_DEPARTMENT_ID,
                      GOLD_NUGGET_ID),
            Professor(VERMA_PROFESSOR_ID,
                      COMPUTER_DEPARTMENT_ID,
                      SILVER_NUGGET_ID),
            Professor(VERMA_PROFESSOR_ID,
                      MATH_DEPARTMENT_ID,
                      GOLD_NUGGET_ID),
            Professor(VERMA_PROFESSOR_ID,
                      MATH_DEPARTMENT_ID,
                      SILVER_NUGGET_ID),
        ]

        for prof, expected_prof in zip(results, expected_results):
            self.assertGreater(prof.get('score'), 0)
            self.assertEqual(
                prof.get('professor_id'), expected_prof.professor_id
            )
            self.assertEqual(
                prof.get('department_id'), expected_prof.department_id
            )
            self.assertEqual(
                prof.get('badge_id'), expected_prof.badge_id
            )

    def test_search_multiple_professors_by_name(self):
        Professor = namedtuple('Professor',
                               ['professor_id',
                                'department_id',
                                'badge_id'])

        results = search_professor('lee')
        self.assertEqual(len(results), 2)

        expected_results = [
            Professor(BOLLINGER_PROFESSOR_ID,
                      LAW_DEPARTMENT_ID,
                      BRONZE_NUGGET_ID),
            Professor(JWL_PROFESSOR_ID,
                      COMPUTER_DEPARTMENT_ID,
                      None),
        ]
        for prof, expected_prof in zip(results, expected_results):
            self.assertGreater(prof.get('score'), 0)
            self.assertEqual(
                prof.get('professor_id'), expected_prof.professor_id
            )
            self.assertEqual(
                prof.get('department_id'), expected_prof.department_id
            )
            self.assertEqual(
                prof.get('badge_id'), expected_prof.badge_id
            )

    def test_search_professor_by_uni(self):
        results = search_professor('lcb50')
        self.assertEqual(len(results), 1)
        self.assertGreater(results[0].get('score'), 0)
        self.assertEqual(
            results[0].get('professor_id'), BOLLINGER_PROFESSOR_ID
        )
        self.assertEqual(results[0].get('department_id'), LAW_DEPARTMENT_ID)
        self.assertEqual(results[0].get('badge_id'), BRONZE_NUGGET_ID)

    def test_search_one_professor_with_limit(self):
        results = search_professor('lee', limit=1)
        self.assertEqual(len(results), 1)
        self.assertGreater(results[0].get('score'), 0)
        self.assertEqual(
            results[0].get('professor_id'), BOLLINGER_PROFESSOR_ID
        )
        self.assertEqual(results[0].get('department_id'), LAW_DEPARTMENT_ID)
        self.assertEqual(results[0].get('badge_id'), BRONZE_NUGGET_ID)

    def test_search_multiple_professors_with_limit(self):
        Professor = namedtuple('Professor',
                               ['professor_id',
                                'department_id',
                                'badge_id'])

        results = search_professor('nakul', limit=2)

        # 2 departments X 2 badges + 2 departments X 1 badge
        self.assertEqual(len(results), 6)

        expected_results = [
            Professor(VERMA_PROFESSOR_ID,
                      COMPUTER_DEPARTMENT_ID,
                      GOLD_NUGGET_ID),
            Professor(VERMA_PROFESSOR_ID,
                      COMPUTER_DEPARTMENT_ID,
                      SILVER_NUGGET_ID),
            Professor(VERMA_PROFESSOR_ID,
                      MATH_DEPARTMENT_ID,
                      GOLD_NUGGET_ID),
            Professor(VERMA_PROFESSOR_ID,
                      MATH_DEPARTMENT_ID,
                      SILVER_NUGGET_ID),
            Professor(BURMA_PROFESSOR_ID,
                      COMPUTER_DEPARTMENT_ID,
                      BRONZE_NUGGET_ID),
            Professor(BURMA_PROFESSOR_ID,
                      MATH_DEPARTMENT_ID,
                      BRONZE_NUGGET_ID),
        ]

        for prof, expected_prof in zip(results, expected_results):
            self.assertGreater(prof.get('score'), 0)
            self.assertEqual(
                prof.get('professor_id'), expected_prof.professor_id
            )
            self.assertEqual(
                prof.get('department_id'), expected_prof.department_id
            )
            self.assertEqual(
                prof.get('badge_id'), expected_prof.badge_id
            )

    def test_search_professor_no_results(self):
        results = search_professor('bad professor name', limit=1)
        self.assertEqual(len(results), 0)
