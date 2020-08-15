from datetime import datetime, timedelta
from decimal import Decimal

from api.tests import LoadersWritersBaseTest
from api.tests.data_tests.common import setup_votes
from api.data.dataloaders.reviews_loader import get_reviews_db


class ReviewsLoaderTest(LoadersWritersBaseTest):
    def test_get_reviews_db_get_only(self):
        test_cases = [{
            'course_prof_ids': [5],
            'ip': '123.456.78.910',
            'expected_res': [{
                'course_professor_id': 5,
                'review_id': 4,
                'content': 'demo content 4',
                'workload': 'demo workload 4',
                'rating': 3,
                'submission_date': datetime.strptime('2019-10-13', '%Y-%m-%d'),
                'upvotes': Decimal(0),
                'downvotes': Decimal(0),
                'funnys': Decimal(0),
                'upvote_clicked': Decimal(0),
                'downvote_clicked': Decimal(0),
                'funny_clicked': Decimal(0)
            }, {
                'course_professor_id': 5,
                'review_id': 5,
                'content': 'demo content 5',
                'workload': 'demo workload 5',
                'rating': 3,
                'submission_date': datetime.strptime('2018-09-01', '%Y-%m-%d'),
                'upvotes': Decimal(1),
                'downvotes': Decimal(2),
                'funnys': Decimal(1),
                'upvote_clicked': Decimal(0),
                'downvote_clicked': Decimal(1),
                'funny_clicked': Decimal(1)
            }, {
                'course_professor_id': 5,
                'review_id': 6,
                'content': 'demo content 6',
                'workload': 'demo workload 6',
                'rating': 3,
                'submission_date': datetime.strptime('2016-05-20', '%Y-%m-%d'),
                'upvotes': Decimal(0),
                'downvotes': Decimal(0),
                'funnys': Decimal(0),
                'upvote_clicked': Decimal(0),
                'downvote_clicked': Decimal(0),
                'funny_clicked': Decimal(0)
            }]
        }, {
            'course_prof_ids': [2, 3],
            'ip': '123.456.78.910',
            'expected_res': [{
                'course_professor_id': 2,
                'review_id': 1,
                'content': 'demo content 1',
                'workload': 'demo workload 1',
                'rating': 3,
                'submission_date': datetime.strptime('2020-02-10', '%Y-%m-%d'),
                'upvotes': Decimal(1),
                'downvotes': Decimal(1),
                'funnys': Decimal(0),
                'upvote_clicked': Decimal(1),
                'downvote_clicked': Decimal(0),
                'funny_clicked': Decimal(0)
            }, {
                'course_professor_id': 2,
                'review_id': 2,
                'content': 'demo content 2',
                'workload': 'demo workload 2',
                'rating': 3,
                'submission_date': datetime.strptime('2017-02-10', '%Y-%m-%d'),
                'upvotes': Decimal(0),
                'downvotes': Decimal(0),
                'funnys': Decimal(1),
                'upvote_clicked': Decimal(0),
                'downvote_clicked': Decimal(0),
                'funny_clicked': Decimal(1)
            }, {
                'course_professor_id': 3,
                'review_id': 3,
                'content': 'demo content 3',
                'workload': 'demo workload 3',
                'rating': 3,
                'submission_date': datetime.strptime('2015-02-10', '%Y-%m-%d'),
                'upvotes': Decimal(2),
                'downvotes': Decimal(0),
                'funnys': Decimal(1),
                'upvote_clicked': Decimal(1),
                'downvote_clicked': Decimal(0),
                'funny_clicked': Decimal(0)
            }]
        }, {
            'course_prof_ids': [12345],
            'ip': '123.456.78.910',
            'expected_res': ()
        }]

        setup_votes(self.cur)

        for test_case in test_cases:
            with self.subTest(test_case):
                res = get_reviews_db(
                    test_case['course_prof_ids'],
                    test_case['ip']
                )
                self.assertEqual(res, test_case['expected_res'])

    def test_get_review_db_with_sort(self):
        def is_sorted(res, key, desc):
            for i in range(len(res) - 1):
                if desc:
                    if res[i][key] < res[i + 1][key]:
                        return False
                else:
                    if res[i][key] > res[i + 1][key]:
                        return False
            return True

        for sort_crit in [
            'rating',
            'submission_date',
            'upvotes',
            'downvotes'
        ]:
            for sort_desc in [True, False]:
                with self.subTest(
                    sort_crit=sort_crit,
                    sort_desc=sort_desc
                ):
                    res = get_reviews_db(
                        [1, 2, 3, 4, 5, 6],
                        "123.456.78.910",
                        sort_crit=sort_crit,
                        sort_desc=sort_desc
                    )
                    self.assertEqual(
                        is_sorted(res, sort_crit, sort_desc),
                        True
                    )

    def test_get_review_db_with_filter_year(self):
        def filter_year_correct(res, year):
            for item in res:
                if (
                    datetime.utcnow() - item['submission_date']
                ) / timedelta(days=1) > year * 365:
                    return False
            return True

        for year in range(10):
            with self.subTest(year):
                res = get_reviews_db(
                    [1, 2, 3, 4, 5, 6],
                    "123.456.78.910",
                    filter_year=year
                )
                self.assertEqual(
                    filter_year_correct(res, year),
                    True
                )
