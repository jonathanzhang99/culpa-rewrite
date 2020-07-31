from unittest import mock
from api.tests import BaseTest


class CoursesTest(BaseTest):
    @mock.patch('api.blueprints.courses.course_summary')
    def test_course_summary(self, mock_course_summary):
        res = self.app.get('/api/courses/1')
        print(res)
