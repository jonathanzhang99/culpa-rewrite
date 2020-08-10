import flask

from api.data.dataloaders.votes_loader import get_user_votes
from api.data.datawriters.votes_writer import add_vote, revoke_vote

vote_blueprint = flask.Blueprint('vote_blueprint', __name__)
validVoteTypes = ['agree', 'disagree', 'funny']


@vote_blueprint.route('/change', methods=['POST'])
def change_vote():
    '''
    function for adding/revoking a specific vote type
    for a review from an ip address
    '''
    try:
        params = flask.request.json

        action = params.get('action')
        voteType = params.get('voteType')
        reviewId = params.get('reviewId')
        ip = flask.request.remote_addr

        actionMap = {'add': add_vote, 'revoke': revoke_vote}

        if voteType not in validVoteTypes or action not in actionMap:
            return {"error": "invalid request"}, 400

        actionMap[action](int(reviewId), voteType, ip)
        return {"status": "success"}

    except Exception as e:
        print(e)
        return {"error": str(e)}, 500


@vote_blueprint.route('/get_clicked_state', methods=['GET'])
def get_clicked_state():
    '''
    function for getting the votes from a specific ip addr
    for a specific review, including whether this user has
    clicked 'upvote', 'downvote', or 'funny'
    '''
    reviewId = int(flask.request.args.get('reviewId'))
    ip = flask.request.remote_addr

    res = {
        'upvoteClicked': False,
        'downvoteClicked': False,
        'funnyClicked': False
    }

    try:
        for vote in get_user_votes(reviewId, ip):
            if vote['type'] == 'agree':
                res['upvoteClicked'] = True
            elif vote['type'] == 'disagree':
                res['downvoteClicked'] = True
            elif vote['type'] == 'funny':
                res['funnyClicked'] = True

    except Exception as e:
        print(e)
        return {"error": str(e)}, 500

    return res
