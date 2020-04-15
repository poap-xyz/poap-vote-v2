import PollService from '../db/services/PollService';
import PollValidator from '../validators/PollValidator';
import { json } from 'express';

class PollController {

    static async fetchPolls(request, response) {
        try {
            const polls = await PollService.getAllPolls();
            const pollsJSON = polls.map(convertPollToJSON);

            response.status(200).send(pollsJSON);
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
            var pollData = {
                fancy_id: await generateFancyId(request.body.title),
                start_date: Date.now(),
                ...request.body,
            }

            pollData.end_date = new Date(pollData.end_date * 1000);

            poll = await PollService.addPoll(pollData);
        } catch (error) {
            response.status(400).send({ error: error.message });
            return;
        }

        response.status(201).send(convertPollToJSON(poll));
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

function convertPollToJSON(poll) {
    let jsonPoll = poll.toJSON();
    jsonPoll.end_date = Math.floor(jsonPoll.end_date.valueOf() / 1000);
    jsonPoll.start_date = Math.floor(jsonPoll.start_date.valueOf() / 1000);

    delete jsonPoll.createdAt;
    delete jsonPoll.updatedAt;

    jsonPoll.poll_options.forEach(option => {
        delete option.createdAt;
        delete option.updatedAt;
    });

    return jsonPoll;
}

export default PollController;
