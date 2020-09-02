def setup_department_professor_courses(cur):
    '''
    This is a utility function that will populate the
    departments, professor, courses, and course_professor
    tables with a minimum set of data for testing.
    '''
    departments = ['Computer Science', 'Law', 'Mathematics']
    cur.executemany(
        'INSERT INTO department (name)'
        'VALUES (%s)',
        departments
    )

    courses = [
        ('Machine Learning', 1, 'COMS 4771'),                   # course_id: 1
        ('Advanced Machine Learning', 1, 'COMS 4774'),          # course_id: 2
        ('Operating Systems', 1, 'COMS 4118'),                  # course_id: 3
        ('Advanced Programming', 1, 'COMS 3157'),               # course_id: 4
        ('Freedom of Speech and Press', 2, 'POLS 3285'),        # course_id: 5
        ('Mathematics of Machine Learning', 3, 'MATH FAKE'),    # course_id: 6
    ]
    cur.executemany(
        'INSERT INTO course (name, department_id, call_number)'
        'VALUES (%s, %s, %s)',
        courses
    )

    # Certain tests depend on the number of professors. If you
    # ned to add additional entries, be sure to update tests.
    professors = [
        ('Nakul', 'Verma', 'nv2274'),   # professor_id: 1
        ('Lee', 'Bollinger', 'lcb50'),  # professor_id: 2
        ('Jae W', 'Lee', 'jwl3'),       # professor_id: 3
        ('Nakul', 'Burma', 'nv2275'),   # professor_id: 4
    ]
    cur.executemany(
        'INSERT INTO professor (first_name, last_name, uni)'
        'VALUES (%s, %s, %s)',
        professors
    )

    # Verma - teaching multiple courses across departments
    # JWL – teaching multiple courses in a department
    # Bollinger – teaching single course
    # AP – multiple professors
    course_professor = [
        (1, 1),  # Verma, Machine Learning
        (1, 2),  # Verma, Advanced Machine learning
        (1, 6),  # Verma, Mathematics of Machine Learning
        (1, 4),  # Verma, Advanced Programming
        (3, 4),  # JWL, Advanced Programming
        (3, 3),  # JWL, Operating Systems
        (2, 5)   # Bollinger, Freedom of Speech
    ]

    cur.executemany(
        'INSERT INTO course_professor (professor_id, course_id)'
        'VALUES (%s, %s)',
        course_professor
    )

    department_professor = [
        (1, 1),  # Verma, Computer Science
        (1, 3),  # Verma, Mathematics
        (2, 2),  # Bollinger, Law
        (3, 1),  # JWL, Computer Science
        (4, 1),  # Burma, Computer Science
        (4, 3),  # Burma, Mathematics
    ]

    cur.executemany(
        'INSERT INTO department_professor (professor_id, department_id)'
        'VALUES (%s, %s)',
        department_professor
    )


def setup_users(cur):
    '''
    This is a utility function that will populate the
    user table with a minimum set of data for testing.
    '''
    users = [
        (1, 'ab123@columbia.edu', 'userab', '###########', ''),
        (2, 'cd456@columbia.edu', 'usercd', '@@@@@@@@@@@', ''),
        (3, 'ef789@columbia.edu', 'useref', '???????????', '')
    ]

    cur.executemany(
        'INSERT INTO user (user_id, email, username, password, privileges)'
        'VALUES (%s, %s, %s, %s, %s)',
        users
    )


# NOTE: this function calls setup_department_professor_courses and
# setup_users
def setup_reviews_and_flags(cur):
    '''
    This is a utility function that will populate the
    departments, professor, courses, course_professor, review
    and flag tables with a minimum set of data for testing.
    '''

    # preliminary setup
    setup_department_professor_courses(cur)
    setup_users(cur)

    reviews = [
        (2, 'demo content 1', '123.0.0.1',
         'demo workload 1', 3, '2020-02-10'),  # review_id: 1
        (2, 'demo content 2', '123.0.0.1',
         'demo workload 2', 3, '2017-02-10'),  # review_id: 2
        (3, 'demo content 3', '123.0.0.1',
         'demo workload 3', 3, '2015-02-10'),  # review_id: 3
        (5, 'demo content 4', '123.0.0.1',
         'demo workload 4', 3, '2019-10-13'),  # review_id: 4
        (5, 'demo content 5', '123.0.0.1',
         'demo workload 5', 3, '2018-09-01'),  # review_id: 5
        (5, 'demo content 6', '123.0.0.1',
         'demo workload 6', 3, '2016-05-20'),  # review_id: 6
    ]

    cur.executemany(
        'INSERT INTO review'
        '(course_professor_id, content, ip, workload, rating, submission_date)'
        'VALUES (%s, %s, %s, %s, %s, %s)',
        reviews
    )

    flags = [
        (1, 2, 'libel', '2020-08-20'),
        (2, 2, 'libel', '2020-08-20'),
        (2, 1, 'approved', '2020-08-19'),
        (3, 1, 'approved', '2020-08-18'),
        (4, 1, 'approved', '2020-08-17'),
        (5, 1, 'approved', '2020-08-16'),
        (6, 1, 'approved', '2020-08-15'),
        (1, 1, 'pending', '2020-08-14'),
        (2, 1, 'pending', '2020-08-13'),
        (3, 1, 'pending', '2020-08-12'),
        (4, 1, 'pending', '2020-08-11'),
        (5, 1, 'pending', '2020-08-10'),
        (6, 1, 'pending', '2020-08-09'),
    ]

    cur.executemany(
        'INSERT INTO flag'
        '(review_id, user_id, type, created_at)'
        'VALUES (%s, %s, %s, %s)',
        flags
    )


# NOTE: this function calls setup_reviews
def setup_votes(cur):
    '''
    This is a utility function that will populate the
    departments, professor, courses, course_professor,
    review, flag, and vote tables with a minimum set of data
    for testing.
    '''
    setup_reviews_and_flags(cur)

    votes = [
        (1, "123.456.78.910", "2020-08-11", "agree"),
        (1, "123.456.78.911", "2020-04-03", "disagree"),
        (2, "123.456.78.910", "2018-08-11", "funny"),
        (3, "123.456.78.910", "2016-01-21", "agree"),
        (3, "123.456.78.911", "2018-11-09", "agree"),
        (3, "123.456.78.912", "2019-02-04", "funny"),
        (5, "123.456.78.910", "2018-10-23", "disagree"),
        (5, "123.456.78.912", "2018-12-11", "disagree"),
        (5, "123.456.78.913", "2019-03-12", "agree"),
        (5, "123.456.78.910", "2019-08-17", "funny"),
    ]

    cur.executemany(
        'INSERT INTO vote (review_id, ip, created_at, type)'
        'VALUES (%s, %s, %s, %s)',
        votes
    )


def setup_for_course_test(cur):
    '''
    This function sets up review and vote tables to test
    courses_loader (to prevent breaking other tests)
    '''
    setup_votes(cur)

    # Insert reviews for courses_loader testing
    reviews = [
        (7, 'positive review', '123.0.0.1', 'workload', 5, '2010-05-20'),
        (7, 'neutral review', '123.0.0.1', 'workload', 3, '2011-05-20'),
        (7, 'negative review', '123.0.0.1', 'workload', 1, '2013-05-20'),
        (7, 'positive review2', '123.0.0.1', 'workload', 5, '2010-05-21'),
        (7, 'negative review2', '123.0.0.1', 'workload', 1, '2012-7-20'),
    ]   # review_ids 7-11

    cur.executemany(
        'INSERT INTO review'
        '(course_professor_id, content, ip, workload, rating, submission_date)'
        'VALUES (%s, %s, %s, %s, %s, %s)',
        reviews
    )

    # Insert votes for courses_loader testing
    votes = [
        (2, "123.456.78.910", "2018-08-11", "agree"),
        (2, "123.456.78.910", "2018-08-11", "agree"),
        (7, "123.456.78.914", "2019-08-17", "agree"),
        (7, "123.456.78.914", "2019-08-17", "agree"),
        (7, "123.456.78.914", "2019-08-17", "agree"),
        (8, "123.456.78.914", "2019-08-17", "agree"),
        (9, "123.456.78.914", "2019-08-17", "agree"),
        (10, "123.456.78.914", "2019-08-17", "agree"),
        (10, "123.456.78.914", "2019-08-17", "agree"),
        (10, "123.456.78.914", "2019-08-17", "agree"),
        (11, "123.456.78.914", "2019-08-17", "agree"),
    ]

    cur.executemany(
        'INSERT INTO vote (review_id, ip, created_at, type)'
        'VALUES (%s, %s, %s, %s)',
        votes
    )

    # Insert course with only neutral reviews
    cur.execute(
        'INSERT INTO course (name, department_id, call_number)'
        'VALUES (%s, %s, %s)',   # course_id: 7
        ('course_without_review', 1, 'CWOR')
    )
    cur.execute(
        'INSERT INTO course_professor (professor_id, course_id)'
        'VALUES (%s, %s)',  # course_professor_id: 8
        (1, 7)
    )
    cur.execute(
        'INSERT INTO review'
        '(course_professor_id, content, ip, workload, rating, submission_date)'
        'VALUES'
        '(%s, %s, %s, %s, %s, %s)',
        (8, 'neutral review', '123.456,78.914',
            'workload', 3, '2019-08-17')    # review_id: 12
    )
    cur.execute(
        'INSERT INTO review'
        '(course_professor_id, content, ip, workload, rating, submission_date)'
        'VALUES'
        '(%s, %s, %s, %s, %s, %s)',
        (8, 'neutral review2', '123.456,78.914',
            'workload', 3, '2019-08-17')    # review_id: 13
    )

    # Insert course without any reviews
    cur.execute(
        'INSERT INTO course (name, department_id, call_number)'
        'VALUES (%s, %s, %s)',   # course_id: 8
        ('course_without_review', 1, 'CWOR')
    )
    cur.execute(
        'INSERT INTO course_professor (professor_id, course_id)'
        'VALUES (%s, %s)',  # course_professor_id: 9
        (1, 7)
    )

    # Insert course with reviews without any votes
    cur.execute(
        'INSERT INTO course (name, department_id, call_number)'
        # course_id: 9
        'VALUES (%s, %s, %s)',
        ('course_with_reviews_without_votes', 1, 'CWRWV')
    )
    cur.execute(
        'INSERT INTO course_professor (professor_id, course_id)'
        'VALUES (%s, %s)',  # course_professor_id: 10
        (1, 8)
    )
    cur.execute(
        'INSERT INTO review'
        '(course_professor_id, content, ip, workload, rating, submission_date)'
        'VALUES'
        '(%s, %s, %s, %s, %s, %s)',
        (9, 'review_without_votes', '123.456,78.914',
            'workload', 3, '2019-08-17')    # review_id: 13
    )

    # make the reviews valid by marking them as approved
    flags = [
        (7, 1, 'approved', '2020-08-19'),
        (8, 1, 'approved', '2020-08-18'),
        (9, 1, 'approved', '2020-08-17'),
        (10, 1, 'approved', '2020-08-16'),
        (11, 1, 'approved', '2020-08-15'),
        (12, 1, 'approved', '2020-08-15'),
        (13, 1, 'approved', '2020-08-15'),
    ]

    cur.executemany(
        'INSERT INTO flag'
        '(review_id, user_id, type, created_at)'
        'VALUES (%s, %s, %s, %s)',
        flags
    )
