import express from 'express';
import bodyParser from 'body-parser';
import db from './db/models';

const app = express();

app.use(bodyParser.json());
app.unsubscribe(bodyParser.urlencoded({extended: false}));

const port = process.env.POAP_VOTE_PORT || 3000;

app.get('/api/polls', async (_request, result) => {
    let polls = await db.Poll.findAll({
        include: {
            model: db.PollOption,
            as: 'poll_options',
            attributes: {exclude: ['createdAt', 'updatedAt']}
        },
        attributes: {exclude: ['createdAt', 'updatedAt']},
    });
    result.status(200).send(polls);
});

app.post('/api/polls', async (request, result) => {
    if (!request.body.title) {
        result.status(400).send({
            "error": "Invalid Data",
        });

        return;
    }

    const poll = await db.Poll.create(request.body, {
        include: [
            {
                model: db.PollOption,
                as: 'poll_options',
            }
        ],
    });

    let pollJSON = poll.toJSON();

    delete pollJSON.createdAt;
    delete pollJSON.updatedAt;

    pollJSON.poll_options.forEach(option => {
        delete option.createdAt;
        delete option.updatedAt;
    });

    result.status(201).send(pollJSON);
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
