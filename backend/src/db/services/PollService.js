import db from '../models';
import smartLog from '../../utils/smartLog';

class PollService {

    static async getAllPolls() {
        try {
            return await db.Poll.findAll({
                include: {
                    model: db.PollOption,
                    as: 'poll_options',
                    attributes: {exclude: ['createdAt', 'updatedAt']}
                },
                attributes: {exclude: ['createdAt', 'updatedAt']},
            });
        } catch (error) {
            smartLog("[PollService]", error);
            throw new Error("There was a database error (PS.1)");
        }
    }

    static async getPaginatedPolls(limit, offset, whereCondition) {

        try {
            let options = {
                include: {
                    model: db.PollOption,
                    as: 'poll_options',
                    attributes: {exclude: ['createdAt', 'updatedAt']},
                },
                where: whereCondition,
                attributes: {exclude: ['createdAt', 'updatedAt']},
                limit: limit,
                offset: offset
            };

            return await db.Poll.findAndCountAll(options);
        } catch (error) {
            smartLog(error);
            throw new Error("There was a database error (PS.1)");
        }
    }

    static async getTotalPollsCount(whereCondition) {
        try {
            return await db.Poll.count({
                where: whereCondition
            });
        } catch (error) {
            smartLog("[PollService]", error);
            throw new Error("There was a database error (PS.1)");
        }
    }

    static async getPollById(pollId) {
        try {
            return await db.Poll.findByPk(pollId, {
                include: {
                    model: db.PollOption,
                    as: 'poll_options',
                    attributes: {exclude: ['createdAt', 'updatedAt']}
                },
            });
        } catch (error) {
            smartLog('[PollService]', error.description);
            throw new Error('There was a database error (PS.2)');
        }
    }

    static async addPoll(pollData) {
        try {
            return await db.Poll.create(pollData, {
                include: [
                    {
                        model: db.PollOption,
                        as: 'poll_options',
                    }
                ],
            });
        } catch (error) {
            smartLog("[PollService]", error);
            throw new Error("There was a database error (PS.3)");
        }
    }
}

export default PollService;
