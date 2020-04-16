import VoteService from '../db/services/VoteService';
import VoteValidator from '../validators/VoteValidator';
import PollService from '../db/services/PollService';

class VoteController {

    static async fetchVotes(request, response) {
        let votes = null;

        try {
            votes = await VoteService.getVotesForPollWithId(request.params.poll_id);
        } catch (error) {
            response.status(400).send({error: error.message});
            return;
        }

        if (!votes) {
            response.status(404).send({
                error: "Poll does not exist",
            });

            return;
        }

        const votesJSON = votes.map(convertVoteToJSON);

        response.status(200).send(votesJSON);
    }

    static async createVote(request, response) {
        let vote = null;

        try {
            const poll = await PollService.getPollById(request.params.poll_id);
            const validation = VoteValidator.validateCreate(request.body, poll);

            if (!validation.isValid) {
                response.status(400).send({
                    "error": validation.errorMessage,
                });

                return;
            }

            const voteData = {
                date_cast: Date.now(),
                ...request.body,
            }

            vote = await VoteService.addVote(voteData);
        } catch (error) {
            response.status(400).send({error: error.message});
            return;
        }

        response.status(201).send(convertVoteToJSON(vote));
    }
}

function convertVoteToJSON(vote) {
    let jsonVote = vote.toJSON();

    delete jsonVote.createdAt;
    delete jsonVote.updatedAt;

    jsonVote.token_ids = jsonVote.token_ids.map(token_id => {
        return parseInt(token_id);
    });

    jsonVote.date_cast = Math.floor(jsonVote.date_cast.valueOf() / 1000);

    return jsonVote;
}

export default VoteController;
