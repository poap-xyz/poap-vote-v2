import VoteService from '../db/services/VoteService';
import VoteValidator from '../validators/VoteValidator';

class VoteController {

    static async fetchVotes(request, response) {
        let votes = null;

        try {
            votes = await VoteService.getVotesForPollWithFancyId(request.params.poll_fancy_id);
        } catch (error) {
            response.status(400).send({error: error.message});
            return;
        }

        const votesJSON = votes.map(convertVoteToJSON);

        response.status(200).send(votesJSON);
    }

    static async createVote(request, response) {
        const validation = VoteValidator.validateCreate(request.body);

        if (!validation.isValid) {
            response.status(400).send({
                "error": validation.errorMessage,
            });

            return;
        }

        let vote = null;

        try {
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
