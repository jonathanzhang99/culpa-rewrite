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
    def __init__(self, *args):
        self.against_clause = False
        self.against_args = []
        super(Match, self).__init__('MATCH', *args)

    def against(self, *args):
        self.against_args = [self.wrap_constant(param) for param in args]
        return self

    def get_function_sql(self, **kwargs):
        sql = super().get_function_sql(**kwargs)

        if self.against_args:
            against_args = ','.join(
                param.get_sql(with_alias=False, **kwargs)
                if hasattr(param, 'get_sql')
                else str(param)
                for param in self.against_args
            )
            sql = f'{sql} AGAINST ({against_args} IN BOOLEAN MODE)'

        return sql
