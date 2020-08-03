from api.data import db
from api.data.dataloaders.professors_loader import get_all_professors, \
    get_professor_courses
from api.tests import LoadersWritersBaseTest
from api.tests.data_tests.common import setup_department_professor_courses


class ProfessorsLoaderTest(LoadersWritersBaseTest):
    def test_load_all_professors(self):
        cur = db.get_cursor()
        cur.execute(
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
        cur = db.get_cursor()
        setup_department_professor_courses(cur)

        expected_courses = [
            {
                'course_professor_id': 7,
                'name': 'Freedom of Speech and Press',
                'call_number': 'POLS 3285'
            }
        ]

        courses = get_professor_courses(2)
        self.assertEqual(expected_courses, courses)

    def test_load_professor_courses_multiple_courses(self):
        # retrieve Verma's courses
        cur = db.get_cursor()
        setup_department_professor_courses(cur)

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

        courses = get_professor_courses(1)
        self.assertEqual(expected_courses, courses)
