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
        }

        let poll = null;

        try {
            poll = await PollService.addPoll(request.body);
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

export default PollController;
