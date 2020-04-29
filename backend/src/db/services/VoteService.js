import db from '../models';
import { Op } from 'sequelize';
import PollService from './PollService';
import smartLog from '../../utils/smartLog';

class VoteService {

    static async getVotesForPoll(poll) {
        if (!poll) {
            return null;
        }

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

    static async getVotesForPollWithId(pollId) {
        const poll = await PollService.getPollById(pollId);
        return await VoteService.getVotesForPoll(poll);
    }

    static async getAccountOrTokenVotesForPollOptions(account, tokenIds, optionIds) {
        try {
            const votes = await db.Vote.findAll({
                where: {
                    [Op.or]: {
                        voter_account: account,
                        token_ids: {
                            [Op.overlap]: tokenIds,
                        },
                    },
                    poll_option_id: {
                        [Op.or]: optionIds,
                    },
                },
            });

            return votes;
        } catch (error) {
            smartLog("[VoteService]", error);
            throw new Error("There was a database error (vs.2)");
        }
    }

    static async addVote(voteData) {
        try {
            return await db.Vote.create(voteData);
        } catch (error) {
            smartLog("[VoteService]", error);
            throw new Error("There was a database error (vs.3)");
        }
    }
}

export default VoteService;
