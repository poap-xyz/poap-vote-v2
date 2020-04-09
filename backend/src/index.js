import express from 'express';
import bodyParser from 'body-parser';
import db from './db/models';
import PollService from './db/services/PollService';
import VoteService from './db/services/VoteService';

const app = express();

app.use(bodyParser.json());
app.unsubscribe(bodyParser.urlencoded({extended: false}));

const port = process.env.POAP_VOTE_PORT || 3000;

app.get('/api/polls', async (_request, result) => {
    try {
        const polls = await PollService.getAllPolls();
        result.status(200).send(polls);
    } catch (error) {
        result.status(400).send({ error: error.message });
        return;
    }
});

app.post('/api/polls', async (request, result) => {
    if (!request.body.title) {
        result.status(400).send({
            "error": "Invalid Data",
        });

        return;
    }

    let poll = null;

    try {
        poll = await PollService.addPoll(request.body);
    } catch (error) {
        result.status(400).send({ error: error.message });
        return;
    }

    let pollJSON = poll.toJSON();

    delete pollJSON.createdAt;
    delete pollJSON.updatedAt;

    pollJSON.poll_options.forEach(option => {
        delete option.createdAt;
        delete option.updatedAt;
    });

    result.status(201).send(pollJSON);
});

app.get('/api/votes/:poll_fancy_id', async (request, result) => {
    let poll = null;

    try {
        poll = await PollService.getPollByFancyId(request.params.poll_fancy_id);
    } catch (error) {
        result.status(400).send({error: error.message});
        return;
    }

    let votes = [];

    for (let index = 0; index < poll.poll_options.length; index++) {
        const poll_option = poll.poll_options[index];
        const option_votes = await poll_option.getVotes();
        votes.push(...option_votes);
    }

    result.status(200).send(votes);
});

app.post('/api/votes/:poll_fancy_id', async (request, result) => {
    // TODO: validate polloption belongs to poll
    // const fancy_id = request.params.poll_fancy_id;
    // let poll = await db.Poll.findOne({
    //     where: {fancy_id: fancy_id},
    //     include: {
    //         model: db.PollOption,
    //         as: 'poll_options',
    //         attributes: {exclude: ['createdAt', 'updatedAt']}
    //     },
    // });

    const vote = await db.Vote.create(request.body);

    let voteJSON = vote.toJSON();
    delete voteJSON.createdAt;
    delete voteJSON.updatedAt;

    result.status(201).send(voteJSON);
});

app.get('*', (_request, result) => {
    result.status(200).send({
        message: 'Hello world!',
    });
});

app.listen(port, () => {
    console.log('Server is running on PORT ', port);
});

export default app;
