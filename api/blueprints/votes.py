import flask

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

        if action == "add":
            add_vote(int(reviewId), voteType == 'upvote',
                     voteType == 'downvote', voteType == 'funny', ip)
        elif action == "revoke":
            revoke_vote(int(reviewId), voteType == 'upvote',
                        voteType == 'downvote', voteType == 'funny', ip)

        return {"status": "success", "failure_msg": None}

    except Exception as e:
        print(e)
        return {"status": "failure", "failure_msg": str(e)}
