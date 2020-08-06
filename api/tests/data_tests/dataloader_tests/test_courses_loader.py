from api.data import db
from api.tests import LoadersWritersBaseTest
import api.data.dataloaders.courses_loader as loader


class CoursesLoaderTest(LoadersWritersBaseTest):
    def populate_department(self):
        cur = db.get_cursor()
        cur.execute(
            'INSERT INTO department (name)'
            'VALUES ("department1"), ("department2")'
        )

    def populate_course(self):
        cur = db.get_cursor()
        self.populate_department()
        cur.execute(
            'INSERT INTO course (name, department_id, call_number)'
            'VALUES ("course1", 1, "XXXX0000"), ("course2", 2, "YYYY0000")'
        )

    def populate_professor(self):
        cur = db.get_cursor()
        cur.execute(
            'INSERT INTO professor (first_name, last_name, uni)'
            'VALUES ("Nakul", "Verma", "nv0000"),'
            '("Lee", "Bollinger", "lb0000")'
        )

    def populate_department_professor(self):
        cur = db.get_cursor()
        cur.execute(
            'INSERT INTO department_professor (professor_id, department_id)'
            'VALUES (1, 1), (1, 2), (2, 2)'
        )

    def populate_course_professor(self):
        cur = db.get_cursor()
        self.populate_course()
        self.populate_professor()
        cur.execute(
            'INSERT INTO course_professor'
            '(professor_id, course_id)'
            'VALUES (1, 1), (2, 1), (2, 2)'
        )

    def test_get_all_courses(self):
        self.populate_course()
        expected_res = [{'course_id': 1,
                         'name': 'course1',
                         'department_id': 1,
                         'call_number': 'XXXX0000',
                         },
                        {'course_id': 2,
                         'name': 'course2',
                         'department_id': 2,
                         'call_number': 'YYYY0000',
                         }]

        res = loader.get_all_courses()

        for i in range(len(res)):
            self.assertDictEqual(expected_res[i], res[i])

    def test_get_course(self):
        self.populate_course()
        course_id = 1
        expected_res = [{'course_id': course_id,
                         'name': 'course1',
                         'department_id': 1,
                         'call_number': 'XXXX0000',
                         }]

        res = loader.get_course(course_id)

        self.assertEqual(expected_res, res)

    def test_get_course_fail(self):
        '''
        Test when get_course couldn't find a matching course in the db
        '''
        self.populate_course()
        course_id = 7

        res = loader.get_course(course_id)

        self.assertTrue(len(res) == 0)

    def test_get_department(self):
        department_id = 1
        self.populate_department()
        expected_res = [{'name': 'department1'}]

        res = loader.get_department(department_id)

        self.assertEqual(expected_res, res)

    def test_get_prof_by_course(self):
        self.populate_course_professor()
        course_id = 1
        res = loader.get_prof_by_course(course_id)
        expected_res = [{'professor_id': 1,
                         'first_name': 'Nakul',
                         'last_name': 'Verma',
                         },
                        {'professor_id': 2,
                         'first_name': 'Lee',
                         'last_name': 'Bollinger',
                         },
                        ]

        for i in range(len(res)):
            self.assertDictEqual(expected_res[i], res[i])

    def test_get_prof_by_course_fail(self):
        '''
        Test if the function raises ValueError given non-existent course_id
        '''
        self.populate_course_professor()
        course_id = 7
        res = loader.get_prof_by_course(course_id)
        self.assertTrue(len(res) == 0)

    def test_get_department_by_prof(self):
        professor_ids = [1, 2]
        self.populate_course_professor()
        self.populate_department_professor()
        res = loader.get_department_by_prof(professor_ids)
        expected_res = [{'professor_id': 1,
                         'department_id': 1,
                         'name': 'department1'},
                        {'professor_id': 1,
                         'department_id': 2,
                         'name': 'department2'},
                        {'professor_id': 2,
                         'department_id': 2,
                         'name': 'department2'}]

        for i in range(len(res)):
            print(f'expected_res[{i}] = {expected_res[i]}')
            print(f'res[{i}] = {res[i]}')

            self.assertDictEqual(expected_res[i], res[i])
