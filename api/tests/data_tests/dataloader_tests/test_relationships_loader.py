from api.data.dataloaders.relationships_loader import \
    count_pending_course_professor_relationships
from api.tests import LoadersWritersBaseTest
from api.tests.data_tests.common import setup_department_professor_courses


class RelationshipsLoaderTest(LoadersWritersBaseTest):
    def test_count_pending_course_professor_relationships(self):
        setup_department_professor_courses(self.cur)
        self.assertEqual(
          count_pending_course_professor_relationships()['count'], 1)

    def test_count_pending_course_professor_relationships_invalid(self):
        # does not set up the database so that it is empty
        self.assertEqual(
          count_pending_course_professor_relationships()['count'], 0)
