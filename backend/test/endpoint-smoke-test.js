import chai from 'chai';
import chatHttp from 'chai-http';
import assertArrays from 'chai-arrays';
import 'chai/register-should';
import app from '../src/index';

chai.use(chatHttp);
chai.use(assertArrays);

const { expect } = chai;

describe('Smoke Testing Endpoints', () => {

    it('should fail to create a poll missing a title', (done) => {
        const poll = {
            polltaker_account: '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b',
            description: 'This could be a very, very long amount of text if we wanted it to be I guess',
            end_date: 1745137203,
            valid_event_ids: [128, 124, 127, 123, 126, 125],
            poll_options: [
                {
                    contents: 'Yes',
                },
                {
                    contents: 'No',
                },
            ],
            attestation: "dca1a1c59b1626c356e2a343775b573a92b3e26f2960086dd33685c4983eacb938367f83ef2fb794b58d69e940ae3c45298cab62932f0258b56c9d00605a9e461c",
        }

        chai.request(app)
            .post('/api/polls')
            .set('Accept', 'application/json')
            .send(poll)
            .end( (_error, result) => {
                expect(result.status).to.equal(400);
                expect(result.body).to.include({
                    error: 'Missing required poll data fields',
                });

                done();
            });
    });

    it('should fail to create a poll including an event that does not exist', (done) => {
        const poll = {
            title: 'The first cool poll',
            polltaker_account: '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b',
            description: 'This could be a very, very long amount of text if we wanted it to be I guess',
            end_date: 1745137203,
            valid_event_ids: [128, 124, 127, 123, 126, 125, 999999],
            poll_options: [
                {
                    contents: 'Yes',
                },
                {
                    contents: 'No',
                },
            ],
            attestation: "dca1a1c59b1626c356e2a343775b573a92b3e26f2960086dd33685c4983eacb938367f83ef2fb794b58d69e940ae3c45298cab62932f0258b56c9d00605a9e461c",
        }

        chai.request(app)
            .post('/api/polls')
            .set('Accept', 'application/json')
            .send(poll)
            .end( (_error, result) => {
                expect(result.status).to.equal(400);
                expect(result.body).to.include({
                    error: 'Invalid ID in qualifying events 999999',
                });

                done();
            });
    });

    it('should create a poll', (done) => {
        const poll = {
            title: 'The first cool poll',
            polltaker_account: '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b',
            description: 'This could be a very, very long amount of text if we wanted it to be I guess',
            end_date: 1745137203,
            valid_event_ids: [128, 124, 127, 123, 126, 125],
            poll_options: [
                {
                    contents: 'Yes',
                },
                {
                    contents: 'No',
                },
            ],
            attestation: 'dca1a1c59b1626c356e2a343775b573a92b3e26f2960086dd33685c4983eacb938367f83ef2fb794b58d69e940ae3c45298cab62932f0258b56c9d00605a9e461c',
        }

        chai.request(app)
            .post('/api/polls')
            .set('Accept', 'application/json')
            .send(poll)
            .end( (_error, result) => {
                expect(result.status).to.equal(201);
                expect(result.body).to.include({
                    id: 1,
                    title: 'The first cool poll',
                    polltaker_account: '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b',
                    description: 'This could be a very, very long amount of text if we wanted it to be I guess',
                    end_date: 1745137203,
                    attestation: 'dca1a1c59b1626c356e2a343775b573a92b3e26f2960086dd33685c4983eacb938367f83ef2fb794b58d69e940ae3c45298cab62932f0258b56c9d00605a9e461c',
                });
                expect(result.body.poll_options.length).to.equal(2);
                expect(result.body.valid_event_ids).to.be.equalTo([128, 124, 127, 123, 126, 125]);

                done();
            });
    });

    it('should fetch the poll in the list of polls', (done) => {
        chai.request(app)
            .get('/api/polls')
            .set('Accept', 'application/json')
            .end( (_error, result) => {
                expect(result.status).to.equal(200);
                expect(result.body.length).to.equal(1);
                expect(result.body[0].title).to.equal('The first cool poll');
                expect(result.body[0].poll_options.length).to.equal(2);

                done();
            });
    });

    it('should fetch the poll with its id', (done) => {
        chai.request(app)
            .get('/api/polls/1')
            .set('Accept', 'application/json')
            .end( (_error, result) => {
                expect(result.status).to.equal(200);
                expect(result.body).to.include({
                    id: 1,
                    title: 'The first cool poll',
                    polltaker_account: '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b',
                    description: 'This could be a very, very long amount of text if we wanted it to be I guess',
                    end_date: 1745137203,
                    attestation: 'dca1a1c59b1626c356e2a343775b573a92b3e26f2960086dd33685c4983eacb938367f83ef2fb794b58d69e940ae3c45298cab62932f0258b56c9d00605a9e461c',
                });
                expect(result.body.poll_options.length).to.equal(2);

                done();
            });
    });

    it('should fail to fetch a poll with an id that does not exit', (done) => {
        chai.request(app)
            .get('/api/polls/2')
            .set('Accept', 'application/json')
            .end( (_error, result) => {
                expect(result.status).to.equal(404);
                expect(result.body).to.include({
                    error: 'Poll does not exist',
                });

                done();
            });
    });

    it('should not create a vote missing a poll option', (done) => {
        const vote = {
            voter_account: "0x8f5906963Ae276E1631EFA8Ff1a9CaE6499EC5E3",
            token_ids: [6068,],
        };

        chai.request(app)
            .post('/api/poll/1/votes')
            .set('Accept', 'application/json')
            .send(vote)
            .end( (_error, result) => {
                expect(result.status).to.equal(400);
                expect(result.body).to.include({
                    error: 'Missing required vote data fields',
                });

                done();
            });
    });

    it('should not create a vote when the option does not exist', (done) => {
        const vote = {
            voter_account: "0x8f5906963Ae276E1631EFA8Ff1a9CaE6499EC5E3",
            token_ids: [6068,],
            poll_option_id: 100,
        };

        chai.request(app)
            .post('/api/poll/1/votes')
            .set('Accept', 'application/json')
            .send(vote)
            .end( (_error, result) => {
                expect(result.status).to.equal(400);
                expect(result.body).to.include({
                    error: 'Option selected does not belong to this poll',
                });

                done();
            });
    });

    it('should not create a vote when using a token the user does not hold', (done) => {
        const vote = {
            voter_account: "0x8f5906963Ae276E1631EFA8Ff1a9CaE6499EC5E3",
            token_ids: [6068, 1234],
            poll_option_id: 1,
        };

        chai.request(app)
            .post('/api/poll/1/votes')
            .set('Accept', 'application/json')
            .send(vote)
            .end( (_error, result) => {
                expect(result.status).to.equal(400);
                expect(result.body).to.include({
                    error: 'Token not held by voting account 1234',
                });

                done();
            });
    });

    it('should create a vote', (done) => {
        const vote = {
            voter_account: "0x8f5906963Ae276E1631EFA8Ff1a9CaE6499EC5E3",
            token_ids: [6068,],
            poll_option_id: 1,
        };

        chai.request(app)
            .post('/api/poll/1/votes')
            .set('Accept', 'application/json')
            .send(vote)
            .end( (_error, result) => {
                expect(result.status).to.equal(201);
                expect(result.body).to.include({
                    id: 1,
                    voter_account: "0x8f5906963Ae276E1631EFA8Ff1a9CaE6499EC5E3",
                    poll_option_id: 1,
                });
                expect(typeof result.body.date_cast).to.equal('number');
                expect(result.body.token_ids).to.be.equalTo([6068,]);

                done();
            });
    });

    it('should not return votes for a poll that does not exist', (done) => {
        chai.request(app)
            .get('/api/poll/2/votes')
            .set('Accept', 'application/json')
            .end( (_error, result) => {
                expect(result.status).to.equal(404);
                expect(result.body).to.include({
                    error: 'Poll does not exist',
                });

                done();
            });
    });

    it('should return votes', (done) => {
        chai.request(app)
            .get('/api/poll/1/votes')
            .set('Accept', 'application/json')
            .end( (_error, result) => {
                expect(result.status).to.equal(200);
                expect(result.body.length).to.equal(1);
                expect(result.body[0].poll_option_id).to.equal(1);
                expect(typeof result.body[0].date_cast).to.equal('number');

                done();
            });
    });

    it('should not create a poll when the attestation is a duplicate', (done) => {
        const poll = {
            title: 'The first cool poll',
            polltaker_account: '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b',
            description: 'This could be a very, very long amount of text if we wanted it to be I guess',
            end_date: 1745137203,
            valid_event_ids: [128, 124, 127, 123, 126, 125],
            poll_options: [
                {
                    contents: 'Yes',
                },
                {
                    contents: 'No',
                },
            ],
            attestation: "dca1a1c59b1626c356e2a343775b573a92b3e26f2960086dd33685c4983eacb938367f83ef2fb794b58d69e940ae3c45298cab62932f0258b56c9d00605a9e461c",
        }

        chai.request(app)
            .post('/api/polls')
            .set('Accept', 'application/json')
            .send(poll)
            .end( (_error, result) => {
                expect(result.status).to.equal(400);
                done();
            });
    });

    it('should create another poll', (done) => {
        const poll = {
            title: 'The first cool poll',
            polltaker_account: '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b',
            description: 'This is actually the second first cool poll',
            end_date: 1745137203,
            valid_event_ids: [128, 124, 127, 123, 126, 125],
            poll_options: [
                {
                    contents: 'Yes',
                },
                {
                    contents: 'No',
                },
                {
                    contents: 'Maybe',
                }
            ],
            attestation: '3d43cf29564ca3047550e956009bb819305805ab4a40842d0136b8b23fa955192796f62995f606e6f189b55b651acb99cc352bb168ec331f47d6e6114d2d2bc91b',
        }

        chai.request(app)
            .post('/api/polls')
            .set('Accept', 'application/json')
            .send(poll)
            .end( (_error, result) => {
                expect(result.status).to.equal(201);
                expect(result.body).to.include({
                    id: 3,
                    title: 'The first cool poll',
                    description: 'This is actually the second first cool poll',
                    polltaker_account: '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b',
                    end_date: 1745137203,
                    attestation: '3d43cf29564ca3047550e956009bb819305805ab4a40842d0136b8b23fa955192796f62995f606e6f189b55b651acb99cc352bb168ec331f47d6e6114d2d2bc91b',
                });
                expect(result.body.valid_event_ids).to.be.equalTo([128, 124, 127, 123, 126, 125]);
                expect(result.body.poll_options.length).to.equal(3);

                done();
            });
    });

    it('should not create a vote when the option does not belong to the poll', (done) => {
        const vote = {
            voter_account: "0x8f5906963Ae276E1631EFA8Ff1a9CaE6499EC5E3",
            token_ids: [6068,],
            poll_option_id: 1,
        };

        chai.request(app)
            .post('/api/poll/3/votes')
            .set('Accept', 'application/json')
            .send(vote)
            .end( (_error, result) => {
                expect(result.status).to.equal(400);
                expect(result.body).to.include({
                    error: 'Option selected does not belong to this poll',
                });

                done();
            });
    });
});