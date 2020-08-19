from api.data import db
from api.data.dataloaders.professors_loader import get_all_professors, \
    get_professor_courses, get_professor_name, search_professor
from api.tests import LoadersWritersBaseTest
from api.tests.data_tests.common import setup_department_professor_courses


VERMA_PROFESSOR_ID = 1
BOLLINGER_PROFESSOR_ID = 2
JWL_PROFESSOR_ID = 3
BAD_PROFESSOR_ID = -1


class ProfessorsLoaderTest(LoadersWritersBaseTest):
    # TODO: This method is temporary to test search functionality
    # and should be removed in the future
    def test_get_all_professors(self):
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

    def test_get_professor_courses_single_course(self):
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

    def test_get_professor_courses_multiple_courses(self):
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

    def test_get_professor_name(self):
        setup_department_professor_courses(self.cur)

        expected_name = [{
            'first_name': 'Nakul',
            'last_name': 'Verma'
        }]

        name = get_professor_name(VERMA_PROFESSOR_ID)
        self.assertEqual(expected_name, name)

    def test_get_professor_name_empty(self):
        setup_department_professor_courses(self.cur)

        res = get_professor_name(BAD_PROFESSOR_ID)
        self.assertFalse(res)

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
