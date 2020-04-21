import PollService from '../db/services/PollService';
import PollValidator from '../validators/PollValidator';

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

    static async fetchPoll(request, response) {
        try {
            const poll = await PollService.getPollById(request.params.id);

            if (!poll) {
                response.status(404).send({
                    error: 'Poll does not exist',
                });

                return;
            }

            response.status(200).send(convertPollToJSON(poll));
        } catch (error) {
            response.status(400).send({error: error.message});
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

function convertPollToJSON(poll) {
    let jsonPoll = poll.toJSON();

    jsonPoll.end_date = Math.floor(jsonPoll.end_date.valueOf() / 1000);
    jsonPoll.start_date = Math.floor(jsonPoll.start_date.valueOf() / 1000);

    jsonPoll.valid_event_ids = jsonPoll.valid_event_ids.map(event_id => {
        return parseInt(event_id);
    });

    delete jsonPoll.createdAt;
    delete jsonPoll.updatedAt;

    jsonPoll.poll_options.forEach(option => {
        delete option.createdAt;
        delete option.updatedAt;
    });

    return jsonPoll;
}

export default PollController;
