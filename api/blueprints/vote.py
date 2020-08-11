import flask

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
