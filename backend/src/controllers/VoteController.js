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

        response.status(200).send(votes);
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

        let voteJSON = vote.toJSON();
        delete voteJSON.createdAt;
        delete voteJSON.updatedAt;

        response.status(201).send(voteJSON);
    }
}

export default VoteController;
