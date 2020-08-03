import flask

from api.data.dataloaders.votes_loader import get_user_votes
from api.data.datasetters.votes_setter import add_vote, revoke_vote

votes_blueprint = flask.Blueprint('votes_blueprint', __name__)


@votes_blueprint.route('/change', methods=['POST'])
def change_vote():
    try:
        params = flask.request.json

        action = params.get('action')
        voteType = params.get('voteType')
        reviewId = params.get('reviewId')
        ip = flask.request.remote_addr

        is_agreed = is_funny = None
        if voteType == 'upvote':
            is_agreed = 1
        elif voteType == 'downvote':
            is_agreed = 0
        elif voteType == 'funny':
            is_funny = 1

        if action == "add":
            add_vote(int(reviewId), is_agreed, is_funny, ip)
        elif action == "revoke":
            revoke_vote(int(reviewId), is_agreed, is_funny, ip)

        return {"status": "success", "failure_msg": None}

    except Exception as e:
        print(e)
        return {"status": "failure", "failure_msg": str(e)}


@votes_blueprint.route('/get_clicked_state', methods=['GET'])
def get_clicked_state():

    reviewId = int(flask.request.args.get('reviewId'))
    ip = flask.request.remote_addr

    res = {
        'upvoteClicked': False,
        'downvoteClicked': False,
        'funnyClicked': False
    }

    try:
        for vote in get_user_votes(reviewId, ip):
            if vote['is_agreed']:
                res['upvoteClicked'] = True
            elif vote['is_agreed'] == 0:
                res['downvoteClicked'] = True
            elif vote['is_funny']:
                res['funnyClicked'] = True

    except Exception as e:
        # TODO
        print(e)

    return res
