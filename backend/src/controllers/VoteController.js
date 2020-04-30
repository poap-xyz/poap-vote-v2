import VoteService from '../db/services/VoteService';
import VoteValidator from '../validators/VoteValidator';
import PollService from '../db/services/PollService';
import POAP from '../poap';
import smartLog from '../utils/smartLog';

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
        let poll = null;
        let tokens = null;
        let vote = null;

        try {
            poll = await PollService.getPollById(request.params.poll_id);
        } catch (error) {
            response.status(400).send({error: error.message});
            return;
        }

        const dataValidation = VoteValidator.validateCreateData(request.body, poll);

        if (!dataValidation.isValid) {
            response.status(400).send({
                "error": dataValidation.errorMessage,
            });

            return;
        }

        try {
            const pollOptionIds = poll.poll_options.map(op => op.id);
            const tokenIds = request.body.token_ids.map(t => t.toString());
            const priorVotes = await VoteService
                                        .getAccountOrTokenVotesForPollOptions(request.body.voter_account,
                                                                                tokenIds,
                                                                                pollOptionIds);

            if (priorVotes.length > 0) {
                response.status(400).send({
                    error: "Account or token cannot vote twice",
                });
                return;
            }
        } catch (error) {
            response.status(400).send({error: error.message});
            return;
        }

        try {
            tokens = await POAP.fetchTokens(request.body.voter_account);
        } catch (error) {
            smartLog("[VoteController] ", error.description)
            response.status(503).send({
                error: "POAP API currently unavailable",
            });

            return;
        }

        const tokenValidation = VoteValidator.validateVoteTokens(request.body, tokens, poll);

        if (!tokenValidation.isValid) {
            response.status(400).send({
                "error": tokenValidation.errorMessage,
            });

            return;
        }

        try {
            const signatureValidation = VoteValidator.validateSignature(request.body);

            if (!signatureValidation.isValid) {
                response.status(400).send({
                    error: 'Signature does not match data submitted',
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
