import flask

from api.data.dataloaders.votes_loader import get_user_votes
from api.data.datawriters.votes_writer import add_vote, revoke_vote

votes_blueprint = flask.Blueprint('votes_blueprint', __name__)
validVoteTypes = ['agree', 'disagree', 'funny']


@votes_blueprint.route('/change', methods=['POST'])
def change_vote():
    try:
        params = flask.request.json

        action = params.get('action')
        voteType = params.get('voteType')
        reviewId = params.get('reviewId')
        ip = flask.request.remote_addr

        if voteType not in validVoteTypes:
            return {
                "status": "failure",
                "failure_msg": "invalid vote type"
            }, 400

        if action == "add":
            add_vote(int(reviewId), voteType, ip)

        elif action == "revoke":
            revoke_vote(int(reviewId), voteType, ip)

        else:
            return {
                "status": "failure",
                "failure_msg": "invalid action type"
            }, 400

        return {"status": "success", "failure_msg": None}

    except Exception as e:
        print(e)
        return {"status": "failure", "failure_msg": str(e)}, 500


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
            if vote['type'] == 'agree':
                res['upvoteClicked'] = True
            elif vote['type'] == 'disagree':
                res['downvoteClicked'] = True
            elif vote['type'] == 'funny':
                res['funnyClicked'] = True

    except Exception as e:
        # TODO
        print(e)

    return res
