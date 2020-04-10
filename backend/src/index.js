import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import PollController from './controllers/PollController';
import VoteController from './controllers/VoteController';

const app = express();

app.use(bodyParser.json());
app.unsubscribe(bodyParser.urlencoded({extended: false}));

app.use(cors());  // TODO: Vary cors policy based on dev vs. prod env

const port = process.env.POAP_VOTE_PORT || 3000;

app.get('/api/polls', PollController.fetchPolls);
app.post('/api/polls', PollController.createPoll);

app.get('/api/votes/:poll_fancy_id', VoteController.fetchVotes);
app.post('/api/votes/:poll_fancy_id', VoteController.createVote);

app.listen(port, () => {
    console.log('Server is running on PORT ', port);
});

export default app;
