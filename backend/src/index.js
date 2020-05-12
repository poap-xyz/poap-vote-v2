import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import PollController from './controllers/PollController';
import VoteController from './controllers/VoteController';

const app = express();

app.use(bodyParser.json());
app.unsubscribe(bodyParser.urlencoded({extended: false}));

app.use(cors());
app.use(helmet());

const port = process.env.POAP_VOTE_PORT || 3000;

app.get('/api/polls', PollController.fetchPolls);
app.post('/api/polls', PollController.createPoll);
app.get('/api/polls/:id', PollController.fetchPoll);

app.get('/api/poll/:poll_id/votes', VoteController.fetchVotes);
app.post('/api/poll/:poll_id/votes', VoteController.createVote);

app.listen(port, () => {
    console.log('Server is running on PORT ', port);
});

export default app;
