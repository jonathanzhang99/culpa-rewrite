def setup_department_professor_courses(cur):
    '''
    This is a utility function that will poopulate the
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
        ('Machine Learning', 1, 'COMS 4771'),
        ('Advanced Machine Learning', 1, 'COMS 4774'),
        ('Operating Systems', 1, 'COMS 4118'),
        ('Advanced Programming', 1, 'COMS 3157'),
        ('Freedom of Speech and Press', 2, 'POLS 3285'),
        ('Mathematics of Machine Learning', 3, 'MATH FAKE'),
    ]
    cur.executemany(
        'INSERT INTO course (name, department_id, call_number)'
        'VALUES (%s, %s, %s)',
        courses
    )

    professors = [
        ('Nakul', 'Verma', 'nv2274'),   # professor_id: 1
        ('Lee', "Bollinger", "lcb50"),  # professor_id: 2
        ('Jae W', 'Lee', 'jwl3')        # professor_id: 3
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


# NOTE: this function calls setup_department_professor_courses
def setup_reviews(cur):
    '''
    This is a utility function that will poopulate the
    departments, professor, courses, course_professor and
    review tables with a minimum set of data for testing.
    '''

    # preliminary setup
    setup_department_professor_courses(cur)

    reviews = [
        (2, 'demo content 1', '123.0.0.1', 'demo workload 1', 3, '2020-02-10'),
        (2, 'demo content 2', '123.0.0.1', 'demo workload 2', 3, '2017-02-10'),
        (3, 'demo content 3', '123.0.0.1', 'demo workload 3', 3, '2015-02-10'),
        (5, 'demo content 4', '123.0.0.1', 'demo workload 4', 3, '2019-10-13'),
        (5, 'demo content 5', '123.0.0.1', 'demo workload 5', 3, '2018-09-01'),
        (5, 'demo content 6', '123.0.0.1', 'demo workload 6', 3, '2016-05-20'),
    ]

    cur.executemany(
        'INSERT INTO review'
        '(course_professor_id, content, ip, workload, rating, submission_date)'
        'VALUES (%s, %s, %s, %s, %s, %s)',
        reviews
    )


# NOTE: this function calls setup_reviews
def setup_votes(cur):
    '''
    This is a utility function that will poopulate the
    departments, professor, courses, course_professor,
    review and vote tables with a minimum set of data
    for testing.
    '''
    setup_reviews(cur)

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
