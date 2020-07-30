from api.data import db
from api.tests import LoadersBaseTest
import api.data.courses_loader as loader


class CoursesLoaderTest(LoadersBaseTest):
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
            'INSERT INTO course (name, department_id)'
            'VALUES ("course1", 1), ("course2", 2)'
        )

    def populate_course_instance(self):
        cur = db.get_cursor()
        self.populate_course()
        cur.execute(
            'INSERT INTO course_instance (year, semester, course_id)'
            'VALUES (1995, 1, 1), (1997, 2, 1),'
            '(2001, 1, 1), (2008, 2, 1), (2012, 2, 1), (2012, 1, 2),'
            '(2013, 1, 2)'
        )

    def populate_professor(self):
        cur = db.get_cursor()
        cur.execute(
            'INSERT INTO professor (first_name, last_name)'
            'VALUES ("Nakul", "Verma"), ("Lee", "Bollinger")'
        )

    def populate_professor_course(self):
        cur = db.get_cursor()
        self.populate_course_instance()
        self.populate_professor()
        cur.execute(
            'INSERT INTO professor_course (professor_id, instance_id)'
            'VALUES (1, 1), (1, 2), (1, 3), (1, 4), (2, 5), (2, 6), (2, 7)'
        )

    def test_get_all_courses(self):
        self.populate_course()
        expected_res = [{'id': 1,
                         'name': 'course1',
                         'department_id': 1
                         },
                        {'id': 2,
                         'name': 'course2',
                         'department_id': 2
                         }]

        res = loader.get_all_courses()

        self.assertEqual(expected_res, res)

    def test_get_course(self):
        self.populate_course()
        course_id = 1
        expected_res = [{'id': course_id,
                         'name': 'course1',
                         'department_id': 1
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

    def test_get_all_course_instances(self):
        self.populate_course_instance()
        course_id = 2
        res = loader.get_all_course_instances(course_id)

        self.assertTrue(len(res) == 2)

    def test_get_recent_course_instance(self):
        self.populate_course_instance()
        course_id = 1
        num_year = 3
        res = loader.get_recent_course_instance(course_id, num_year)
        expected_res = [{'id': 5,
                         'year': 2012,
                         'semester': 2,
                         'course_id': 1},
                        {'id': 4,
                         'year': 2008,
                         'semester': 2,
                         'course_id': 1},
                        {'id': 3,
                         'year': 2001,
                         'semester': 1,
                         'course_id': 1
                         }]

        self.assertEqual(expected_res, res)

    def test_get_recent_course_instance_underflow(self):
        '''
        Test when requested number of years exceeds number of years in the db
        '''
        self.populate_course_instance()
        course_id = 1
        num_year = 10
        res = loader.get_recent_course_instance(course_id, num_year)
        expected_res = [{'id': 5,
                         'year': 2012,
                         'semester': 2,
                         'course_id': 1},
                        {'id': 4,
                         'year': 2008,
                         'semester': 2,
                         'course_id': 1},
                        {'id': 3,
                         'year': 2001,
                         'semester': 1,
                         'course_id': 1},
                        {'id': 2,
                         'year': 1997,
                         'semester': 2,
                         'course_id': 1},
                        {'id': 1,
                         'year': 1995,
                         'semester': 1,
                         'course_id': 1},
                        ]

        self.assertEqual(expected_res, res)

    def test_get_prof_by_course(self):
        self.populate_professor_course()
        course_id = 1
        res = loader.get_prof_by_course(course_id)
        expected_res = [{'id': 1,  # this is professor.id (might consider
                         # naming this professor.professor_id b/c of joins?)
                         'first_name': 'Nakul',
                         'last_name': 'Verma',
                         'instance_id': 1},
                        {'id': 1,
                         'first_name': 'Nakul',
                         'last_name': 'Verma',
                         'instance_id': 2},
                        {'id': 1,
                         'first_name': 'Nakul',
                         'last_name': 'Verma',
                         'instance_id': 3},
                        {'id': 1,
                         'first_name': 'Nakul',
                         'last_name': 'Verma',
                         'instance_id': 4},
                        {'id': 2,
                         'first_name': 'Lee',
                         'last_name': 'Bollinger',
                         'instance_id': 5},
                        ]

        self.assertEqual(expected_res, res)

    def test_get_prof_by_course_fail(self):
        '''
        Test if the function raises ValueError given non-existent course_id
        '''
        self.populate_professor_course()
        course_id = 7

        self.assertRaises(ValueError, loader.get_prof_by_course, course_id)
