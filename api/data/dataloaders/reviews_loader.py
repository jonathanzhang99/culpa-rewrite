from pypika import functions as fn, \
    Case, \
    Criterion, \
    CustomFunction

from api.data.common import vote

# common queries / functions
DateDiff = CustomFunction('DATEDIFF', ['start_date', 'end_date'])


# valid vote types: agree, disagree, funny
def vote_count(vote_type):
    return fn.Sum(Case().when(
                vote.type == vote_type, 1
            ).else_(0)).as_(f'{vote_type}s')


def vote_clicked(vote_type, ip):
    return fn.Sum(Case().when(
                Criterion.all([
                    vote.type == vote_type,
                    vote.ip == ip
                ]), 1
            ).else_(0)).as_(f'{vote_type}_clicked')
