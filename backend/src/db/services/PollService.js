import db from '../models';

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
            console.log("[PollService]", error);
            throw new Error("There was a database error (PS.1)");
        }
    }

    static async getPollByFancyId(fancy_id) {
        try{
            return await db.Poll.findOne({
                where: {fancy_id: fancy_id},
                include: {
                    model: db.PollOption,
                    as: 'poll_options',
                    attributes: {exclude: ['createdAt', 'updatedAt']}
                },
            });
        } catch(error) {
            console.log("[PollService]", error);
            throw new Error("There was a database error (PS.2)");
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
            console.log("[PollService]", error);
            throw new Error("There was a database error (PS.3)");
        }
    }
}

export default PollService;
