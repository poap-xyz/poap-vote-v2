import PollService from '../db/services/PollService';
import PollValidator from '../validators/PollValidator';

class PollController {

    static async fetchPolls(request, response) {
        try {
            const polls = await PollService.getAllPolls();
            response.status(200).send(polls);
        } catch (error) {
            response.status(400).send({ error: error.message });
            return;
        }
    }

    static async createPoll(request, response) {
        const validation = PollValidator.validateCreate(request.body);

        if (!validation.isValid) {
            response.status(400).send({
                "error": validation.errorMessage,
            });

            return;
        }

        let poll = null;

        try {
            const pollData = {
                fancy_id: await generateFancyId(request.body.title),
                ...request.body,
            }

            poll = await PollService.addPoll(pollData);
        } catch (error) {
            response.status(400).send({ error: error.message });
            return;
        }

        let pollJSON = poll.toJSON();

        delete pollJSON.createdAt;
        delete pollJSON.updatedAt;

        pollJSON.poll_options.forEach(option => {
            delete option.createdAt;
            delete option.updatedAt;
        });

        response.status(201).send(pollJSON);
    }
}

async function generateFancyId(title) {
    const derived_fancy = title
                            .substring(0, 57)
                            .trim()
                            .toLowerCase()
                            .replace(/\s+/g, '-')
                            .replace(/[^\w\s-]+/g, '');

    let existing_poll = await PollService.getPollByFancyId(derived_fancy);

    if (!existing_poll) {
        return derived_fancy;
    }

    for (let index = 1; index < 10000; index++) {
        let appended_fancy = `${derived_fancy}-${index}`
        existing_poll = await PollService.getPollByFancyId(appended_fancy);

        if (!existing_poll) {
            return appended_fancy;
        }
    }

    throw new Error('Unable to generate unique fancy_id');
}

export default PollController;
