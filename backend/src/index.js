import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import SlowDown from 'express-slow-down';
import PollController from './controllers/PollController';
import VoteController from './controllers/VoteController';
import POAP from "./poap";

const app = express();

app.enable("trust proxy");
app.disable('x-powered-by');

app.use(bodyParser.json());
app.unsubscribe(bodyParser.urlencoded({extended: false}));

app.use(cors());
app.use(helmet());
app.use(compression());

const speedLimiter = SlowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 500,          // allow 500 requests per 15 minutes, then...
    delayMs: 100,              // begin adding 100ms of delay per request above 100:
  });

app.use(speedLimiter);

const port = process.env.POAP_VOTE_PORT || 3000;

app.get('/api/polls', PollController.fetchPolls);
app.get('/api/paginated-polls', PollController.fetchPaginatedPolls);
app.post('/api/polls', PollController.createPoll);
app.get('/api/polls/:id', PollController.fetchPoll);

app.get('/api/poll/:poll_id/votes', VoteController.fetchVotes);

const poapApiKey = process.env.POAP_API_KEY;
const poapService = new POAP(poapApiKey);
const voteController = new VoteController(poapService);

const voteHandler = async (request, response) => {
    return await voteController.createVote(request, response);
};
app.post('/api/poll/:poll_id/votes', voteHandler);

const voteDelegatedHandler = async (request, response) => {
    return await voteController.createVoteDelegated(request, response);
};
app.post('/api/polls/:poll_id/votes-delegated', voteDelegatedHandler);

app.listen(port, () => {
    console.log('Server is running on PORT ', port);
});

export default app;
