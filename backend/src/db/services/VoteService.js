import db from '../models';
import PollService from './PollService';
import smartLog from '../../utils/smartLog';

class VoteService {

    static async getVotesForPoll(poll) {
        try {
            let votes = [];

            for (let index = 0; index < poll.poll_options.length; index++) {
                const poll_option = poll.poll_options[index];
                const option_votes = await poll_option.getVotes();
                votes.push(...option_votes);
            }

            return votes;
        } catch (error) {
            smartLog("[VoteService]", error);
            throw new Error("There was a database error (vs.1)");
        }
    }

    static async getVotesForPollWithFancyId(fancy_id) {
        const poll = await PollService.getPollByFancyId(fancy_id);
        return await VoteService.getVotesForPoll(poll);
    }

    static async addVote(voteData) {
        try {
            return await db.Vote.create(voteData);
        } catch (error) {
            smartLog("[VoteService]", error);
            throw new Error("There was a database error (vs.2)");
        }
    }
}

export default VoteService;
