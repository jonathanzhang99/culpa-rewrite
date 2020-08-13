from pypika import Table
from pypika.terms import Function


department = Table('department')
announcement = Table('announcement')
course = Table('course')
course_professor = Table('course_professor')
professor = Table('professor')
department_professor = Table('department_professor')
review = Table('review')
vote = Table('vote')
user = Table('user')
flag = Table('flag')


class Match(Function):
    '''
    This is a custom PyPika extension that uses the built-in abstractions from
    the library in order to provide support for MySql Fulltext search quueries.
    Please refer to the following link to see the original definitions that
    this class extends.

    https://github.com/kayak/pypika/blob/9ebe5bccb13a957287c6556dcc531f073407dd51/pypika/terms.py#L1113
    '''
    def __init__(self, *args):
        self.against_param = None
        super(Match, self).__init__('MATCH', *args)

    def against(self, param):
        self.against_param = self.wrap_constant(param)
        return self

    def get_function_sql(self, **kwargs):
        sql = super().get_function_sql(**kwargs)

        if self.against_param:
            sql = f'{sql} AGAINST ({self.against_param} IN BOOLEAN MODE)'

        return sql
