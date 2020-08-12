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

    department_professor = [
        (1, 1),  # Verma, Computer Science
        (1, 3),  # Verma, Mathematics
        (2, 2),  # Bollinger, Law
        (3, 1),  # JWL, Computer Science
    ]

    cur.executemany(
        'INSERT INTO department_professor (professor_id, department_id)'
        'VALUES (%s, %s)',
        department_professor
    )
