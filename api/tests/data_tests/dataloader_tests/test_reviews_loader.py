from datetime import datetime, timedelta
from decimal import Decimal

from api.tests import LoadersWritersBaseTest
from api.tests.data_tests.common import setup_votes, setup_reviews_and_flags,\
    setup_for_course_test
from api.data.dataloaders.reviews_loader import get_reviews_with_query_prefix,\
    prepare_course_query_prefix, prepare_professor_query_prefix,\
    get_single_review, get_course_review_summary


class ReviewsLoaderTest(LoadersWritersBaseTest):
    def test_get_reviews_with_query_prefix_get_only(self):
        test_cases = [{
            'type': 'course',
            'id': 4,
            'expected_res': [{
                'professor_id': 3,
                'first_name': 'Jae W',
                'last_name': 'Lee',
                'uni': 'jwl3',
                'review_id': 4,
                'content': 'demo content 4',
                'workload': 'demo workload 4',
                'rating': 3,
                'submission_date': datetime.strptime('2019-10-13', '%Y-%m-%d'),
                'agrees': Decimal(0),
                'disagrees': Decimal(0),
                'funnys': Decimal(0),
                'agree_clicked': Decimal(0),
                'disagree_clicked': Decimal(0),
                'funny_clicked': Decimal(0)
            }, {
                'professor_id': 3,
                'first_name': 'Jae W',
                'last_name': 'Lee',
                'uni': 'jwl3',
                'review_id': 5,
                'content': 'demo content 5',
                'workload': 'demo workload 5',
                'rating': 3,
                'submission_date': datetime.strptime('2018-09-01', '%Y-%m-%d'),
                'agrees': Decimal(1),
                'disagrees': Decimal(2),
                'funnys': Decimal(1),
                'agree_clicked': Decimal(0),
                'disagree_clicked': Decimal(1),
                'funny_clicked': Decimal(1)
            }, {
                'professor_id': 3,
                'first_name': 'Jae W',
                'last_name': 'Lee',
                'uni': 'jwl3',
                'review_id': 6,
                'content': 'demo content 6',
                'workload': 'demo workload 6',
                'rating': 3,
                'submission_date': datetime.strptime('2016-05-20', '%Y-%m-%d'),
                'agrees': Decimal(0),
                'disagrees': Decimal(0),
                'funnys': Decimal(0),
                'agree_clicked': Decimal(0),
                'disagree_clicked': Decimal(0),
                'funny_clicked': Decimal(0)
            }]
        }, {
            'type': 'professor',
            'id': 1,
            'expected_res': [{
                'course_id': 6,
                'call_number': 'MATH FAKE',
                'name': 'Mathematics of Machine Learning',
                'review_id': 3,
                'content': 'demo content 3',
                'workload': 'demo workload 3',
                'rating': 3,
                'submission_date': datetime.strptime('2015-02-10', '%Y-%m-%d'),
                'agrees': Decimal(2),
                'disagrees': Decimal(0),
                'funnys': Decimal(1),
                'agree_clicked': Decimal(1),
                'disagree_clicked': Decimal(0),
                'funny_clicked': Decimal(0)
            }]
        }, {
            'type': 'professor',
            'id': 12345,
            'expected_res': ()
        }, {
            'type': 'course',
            'id': 56789,
            'expected_res': ()
        }]

        ip = '123.456.78.910'
        setup_votes(self.cur)
        page_type_and_query_prefixes = {
            'course': prepare_course_query_prefix,
            'professor': prepare_professor_query_prefix
        }

        for test_case in test_cases:
            with self.subTest(test_case):
                pf = page_type_and_query_prefixes[test_case['type']](
                    test_case['id']
                )
                res = get_reviews_with_query_prefix(pf, ip)
                self.assertEqual(res, test_case['expected_res'])

    def test_get_review_db_with_sort(self):
        def is_sorted(res, key, order):
            for i in range(len(res) - 1):
                if order == 'DESC':
                    if res[i][key] < res[i + 1][key]:
                        return False
                else:
                    if res[i][key] > res[i + 1][key]:
                        return False
            return True

        setup_reviews_and_flags(self.cur)
        for sort_criterion in [
            'rating',
            'submission_date',
            'agrees',
            'disagrees'
        ]:
            for sort_order in ['DESC', 'ASC']:
                with self.subTest(
                    sort_criterion=sort_criterion,
                    sort_order=sort_order
                ):
                    res = get_reviews_with_query_prefix(
                        prepare_professor_query_prefix(3),
                        "123.456.78.910",
                        sort_criterion=sort_criterion,
                        sort_order=sort_order
                    )
                    self.assertEqual(
                        is_sorted(res, sort_criterion, sort_order),
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

        setup_reviews_and_flags(self.cur)
        for year in range(1, 6):
            with self.subTest(year):
                res = get_reviews_with_query_prefix(
                    prepare_professor_query_prefix(3),
                    "123.456.78.910",
                    filter_year=year
                )
                self.assertEqual(
                    filter_year_correct(res, year),
                    True
                )

    def test_get_review_db_with_filter_list(self):
        test_cases = [{
            'type': 'professor',
            'id': 3,
            'filter_list': [4, 5],
            'expected_review_ids': [4, 5, 6]
        }, {
            'type': 'professor',
            'id': 3,
            'filter_list': [1, 2, 3],
            'expected_review_ids': []
        }, {
            'type': 'course',
            'id': 2,
            'filter_list': [1],
            'expected_review_ids': []
        }, {
            'type': 'course',
            'id': 4,
            'filter_list': [1, 2],
            'expected_review_ids': []
        }]

        setup_votes(self.cur)
        page_type_and_query_prefixes = {
            'course': prepare_course_query_prefix,
            'professor': prepare_professor_query_prefix
        }

        for test_case in test_cases:
            with self.subTest(test_case):
                res = get_reviews_with_query_prefix(
                    page_type_and_query_prefixes[test_case['type']](
                        test_case['id'],
                        filter_list=test_case['filter_list']
                    ),
                    "123.456.78.910"
                )
                self.assertEqual(
                    [x['review_id'] for x in res],
                    test_case['expected_review_ids']
                )

    def test_get_single_review(self):
        cases = [{
            'review_id': 2,
            'content': 'demo content 2',
            'workload': 'demo workload 2',
            'rating': 3,
            'submission_date': datetime.strptime('2017-02-10', '%Y-%m-%d'),
            'course_id': 2,
            'course_name': 'Advanced Machine Learning',
            'course_call_number': 'COMS 4774',
            'prof_id': 1,
            'prof_first_name': 'Nakul',
            'prof_last_name': 'Verma',
            'prof_uni': 'nv2274',
            'flag_type': 'libel',
            'agrees': Decimal(0),
            'disagrees': Decimal(0),
            'funnys': Decimal(1),
            'agree_clicked': Decimal(0),
            'disagree_clicked': Decimal(0),
            'funny_clicked': Decimal(1)
        }, {
            'review_id': 5,
            'content': 'demo content 5',
            'workload': 'demo workload 5',
            'rating': 3,
            'submission_date': datetime.strptime('2018-09-01', '%Y-%m-%d'),
            'course_id': 4,
            'course_name': 'Advanced Programming',
            'course_call_number': 'COMS 3157',
            'prof_id': 3,
            'prof_first_name': 'Jae W',
            'prof_last_name': 'Lee',
            'prof_uni': 'jwl3',
            'flag_type': 'approved',
            'agrees': Decimal(1),
            'disagrees': Decimal(2),
            'funnys': Decimal(1),
            'agree_clicked': Decimal(0),
            'disagree_clicked': Decimal(1),
            'funny_clicked': Decimal(1)
        }]
        ip = '123.456.78.910'
        setup_votes(self.cur)

        for case in cases:
            with self.subTest(case):
                res = get_single_review(case['review_id'], ip)
                self.assertEqual(res, case)

    def test_get_single_review_invalid_id(self):
        self.assertEqual(None, get_single_review(
            12345, '123.456.78.910'
        ))

    def test_get_course_review_summary(self):
        '''
        Test cases:
            1. Most common -> most positive/negative review
                - There are multiple reviews for the course_id
                - There are positive and negative reviews
            2. All neutral reviews -> one review with most agree votes
                - There are only reviews with the same rating
            3. All reviews libelous -> nothing
            4. No reviews -> nothing
            5. No review has any votes -> nothing
        '''
        test_cases = [{
            'course_id': 5,
            'expected_res': [
                {
                    'professor_id': 2,
                    'first_name': 'Lee',
                    'last_name': 'Bollinger',
                    'uni': 'lcb50',
                    'review_id': 7,
                    'content': 'positive review',
                    'workload': 'workload',
                    'rating': 5,
                    'submission_date': datetime(2010, 5, 20, 0, 0),
                    'agrees': Decimal('3'),
                    'disagrees': Decimal('0'),
                    'funnys': Decimal('0'),
                    'agree_clicked': Decimal('0'),
                    'disagree_clicked': Decimal('0'),
                    'funny_clicked': Decimal('0')
                },
                {
                    'professor_id': 2,
                    'first_name': 'Lee',
                    'last_name': 'Bollinger',
                    'uni': 'lcb50',
                    'review_id': 9,
                    'content': 'negative review',
                    'workload': 'workload',
                    'rating': 1,
                    'submission_date': datetime(2013, 5, 20, 0, 0),
                    'agrees': Decimal('1'),
                    'disagrees': Decimal('0'),
                    'funnys': Decimal('0'),
                    'agree_clicked': Decimal('0'),
                    'disagree_clicked': Decimal('0'),
                    'funny_clicked': Decimal('0')
                }
            ]
        },
            {
            'course_id': 7,
            'expected_res': [
                {
                    'professor_id': 1,
                    'first_name': 'Nakul',
                    'last_name': 'Verma',
                    'uni': 'nv2274',
                    'review_id': 12,
                    'content': 'neutral review',
                    'workload': 'workload',
                    'rating': 3,
                    'submission_date': datetime(2019, 8, 17, 0, 0),
                    'agrees': Decimal('0'),
                    'disagrees': Decimal('0'),
                    'funnys': Decimal('0'),
                    'agree_clicked': Decimal('0'),
                    'disagree_clicked': Decimal('0'),
                    'funny_clicked': Decimal('0')
                }
            ]
        },
            {
            'course_id': 2,
            'expected_res': ()
        },
            {
            'course_id': 8,
            'expected_res': ()
        },
            {
            'course_id': 9,
            'expected_res': ()
        }]
        setup_for_course_test(self.cur)
        ip = ''
        for test_case in test_cases:
            with self.subTest(test_case):
                res = get_course_review_summary(
                    prepare_course_query_prefix(test_case['course_id']), ip)
                self.assertEqual(res, test_case['expected_res'])
