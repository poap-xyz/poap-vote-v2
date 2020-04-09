import VoteService from '../db/services/VoteService';

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
        let vote = null;

        try {
            vote = await VoteService.addVote(request.body);
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
