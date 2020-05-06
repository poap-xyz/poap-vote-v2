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
            polltaker_account: '0xE0a68584111D702a141beCB6692631F1Dae4711f',
            description: 'This could be a very, very long amount of text if we wanted it to be I guess',
            end_date: 1745180454,
            valid_event_ids: [128, 124, 127, 123, 126, 125, 129, 130],
            poll_options: ['Yes', 'No'],
            attestation: "5a3de160a7b92170a90367ebbe76ddf10e81c126d0b13bd308f8a503a68f843e751949ee0601e8f58d26b062f8799243b2d7829c42bd63bfb0c072c8634e0d661c",
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
            polltaker_account: '0xE0a68584111D702a141beCB6692631F1Dae4711f',
            description: 'This could be a very, very long amount of text if we wanted it to be I guess',
            end_date: 1745180454,
            valid_event_ids: [128, 124, 127, 123, 126, 125, 129, 130, 999999],
            poll_options: ['Yes', 'No'],
            attestation: "5a3de160a7b92170a90367ebbe76ddf10e81c126d0b13bd308f8a503a68f843e751949ee0601e8f58d26b062f8799243b2d7829c42bd63bfb0c072c8634e0d661c",
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
            polltaker_account: '0xE0a68584111D702a141beCB6692631F1Dae4711f',
            description: 'This could be a very, very long amount of text if we wanted it to be I guess',
            end_date: 1745180454,
            valid_event_ids: [128, 124, 127, 123, 126, 125, 129, 130],
            poll_options: ['Yes', 'No'],
            attestation: '5a3de160a7b92170a90367ebbe76ddf10e81c126d0b13bd308f8a503a68f843e751949ee0601e8f58d26b062f8799243b2d7829c42bd63bfb0c072c8634e0d661c',
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
                    polltaker_account: '0xE0a68584111D702a141beCB6692631F1Dae4711f',
                    description: 'This could be a very, very long amount of text if we wanted it to be I guess',
                    end_date: 1745180454,
                    attestation: '5a3de160a7b92170a90367ebbe76ddf10e81c126d0b13bd308f8a503a68f843e751949ee0601e8f58d26b062f8799243b2d7829c42bd63bfb0c072c8634e0d661c',
                });
                expect(result.body.poll_options.length).to.equal(2);
                expect(result.body.valid_event_ids).to.be.equalTo([128, 124, 127, 123, 126, 125, 129, 130]);

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
                    polltaker_account: '0xE0a68584111D702a141beCB6692631F1Dae4711f',
                    description: 'This could be a very, very long amount of text if we wanted it to be I guess',
                    end_date: 1745180454,
                    attestation: '5a3de160a7b92170a90367ebbe76ddf10e81c126d0b13bd308f8a503a68f843e751949ee0601e8f58d26b062f8799243b2d7829c42bd63bfb0c072c8634e0d661c',
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
            attestation: "f88bd9bcdd42a63fe78d92180588b369d292694bca974594d60d44d97f11790e77dc3505a15fda0a52686bed6bb6d2f9cc9bc4e29e2ddd19c0d5e1f2903878e01b",
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
            attestation: "f88bd9bcdd42a63fe78d92180588b369d292694bca974594d60d44d97f11790e77dc3505a15fda0a52686bed6bb6d2f9cc9bc4e29e2ddd19c0d5e1f2903878e01b",
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
            attestation: "f88bd9bcdd42a63fe78d92180588b369d292694bca974594d60d44d97f11790e77dc3505a15fda0a52686bed6bb6d2f9cc9bc4e29e2ddd19c0d5e1f2903878e01b",
        };

        chai.request(app)
            .post('/api/poll/1/votes')
            .set('Accept', 'application/json')
            .send(vote)
            .end( (_error, result) => {
                expect(result.status).to.equal(400);
                expect(result.body).to.include({
                    error: 'Token with Id 1234 not held by voting account',
                });

                done();
            });
    });

    it('should not create a vote when using a token that is not from a qualifying event', (done) => {
        const vote = {
            voter_account: "0x8f5906963Ae276E1631EFA8Ff1a9CaE6499EC5E3",
            token_ids: [6068, 8019],
            poll_option_id: 1,
            attestation: "f88bd9bcdd42a63fe78d92180588b369d292694bca974594d60d44d97f11790e77dc3505a15fda0a52686bed6bb6d2f9cc9bc4e29e2ddd19c0d5e1f2903878e01b",
        };

        chai.request(app)
            .post('/api/poll/1/votes')
            .set('Accept', 'application/json')
            .send(vote)
            .end( (_error, result) => {
                expect(result.status).to.equal(400);
                expect(result.body).to.include({
                    error: 'Token with Id 8019 not qualified to vote in this poll',
                });

                done();
            });
    });

    it('should not create a vote when the signature does not match the data', (done) => {
        const vote = {
            voter_account: "0x8f5906963Ae276E1631EFA8Ff1a9CaE6499EC5E3",
            token_ids: [6068,],
            poll_option_id: 2,
            attestation: "f88bd9bcdd42a63fe78d92180588b369d292694bca974594d60d44d97f11790e77dc3505a15fda0a52686bed6bb6d2f9cc9bc4e29e2ddd19c0d5e1f2903878e01b",
        };

        chai.request(app)
            .post('/api/poll/1/votes')
            .set('Accept', 'application/json')
            .send(vote)
            .end( (_error, result) => {
                expect(result.status).to.equal(400);
                expect(result.body).to.include({
                    error: 'Signature does not match data submitted',
                });

                done();
            });
    });

    it('should create a vote', (done) => {
        const vote = {
            voter_account: "0x8f5906963Ae276E1631EFA8Ff1a9CaE6499EC5E3",
            token_ids: [6068,],
            poll_option_id: 1,
            attestation: "f88bd9bcdd42a63fe78d92180588b369d292694bca974594d60d44d97f11790e77dc3505a15fda0a52686bed6bb6d2f9cc9bc4e29e2ddd19c0d5e1f2903878e01b",
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
                    attestation: "f88bd9bcdd42a63fe78d92180588b369d292694bca974594d60d44d97f11790e77dc3505a15fda0a52686bed6bb6d2f9cc9bc4e29e2ddd19c0d5e1f2903878e01b",
                });
                expect(typeof result.body.date_cast).to.equal('number');
                expect(result.body.token_ids).to.be.equalTo([6068,]);

                done();
            });
    });

    it('should not let a user vote twice', (done) => {
        const vote = {
            voter_account: "0x8f5906963Ae276E1631EFA8Ff1a9CaE6499EC5E3",
            token_ids: [6068,],
            poll_option_id: 1,
            attestation: "f88bd9bcdd42a63fe78d92180588b369d292694bca974594d60d44d97f11790e77dc3505a15fda0a52686bed6bb6d2f9cc9bc4e29e2ddd19c0d5e1f2903878e01b",
        };

        chai.request(app)
            .post('/api/poll/1/votes')
            .set('Accept', 'application/json')
            .send(vote)
            .end( (_error, result) => {
                expect(result.status).to.equal(400);
                expect(result.body).to.include({
                    error: 'Account or token cannot vote twice',
                });

                done();
            });
    });

    it('should note let a token vote twice', (done) => {
        const vote = {
            voter_account: "0xE0a68584111D702a141beCB6692631F1Dae4711f",
            token_ids: [6068, 1234],
            poll_option_id: 1,
            attestation: "f88bd9bcdd42a63fe78d92180588b369d292694bca974594d60d44d97f11790e77dc3505a15fda0a52686bed6bb6d2f9cc9bc4e29e2ddd19c0d5e1f2903878e01b",
        };

        chai.request(app)
            .post('/api/poll/1/votes')
            .set('Accept', 'application/json')
            .send(vote)
            .end( (_error, result) => {
                expect(result.status).to.equal(400);
                expect(result.body).to.include({
                    error: 'Account or token cannot vote twice',
                });

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
            polltaker_account: '0xE0a68584111D702a141beCB6692631F1Dae4711f',
            description: 'This could be a very, very long amount of text if we wanted it to be I guess',
            end_date: 1745180454,
            valid_event_ids: [128, 124, 127, 123, 126, 125, 129, 130],
            poll_options: ['Yes', 'No'],
            attestation: "5a3de160a7b92170a90367ebbe76ddf10e81c126d0b13bd308f8a503a68f843e751949ee0601e8f58d26b062f8799243b2d7829c42bd63bfb0c072c8634e0d661c",
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
            polltaker_account: '0xE0a68584111D702a141beCB6692631F1Dae4711f',
            description: 'This is actually the second first cool poll',
            end_date: 1745180444,
            valid_event_ids: [128, 124, 127, 123, 126, 125, 129, 130],
            poll_options: ['Yes', 'No', 'Maybe'],
            attestation: 'ea9b4c64b0b5f03b7f435856813c9500dd4d384e17f099e8f2fb6852c4fe070c62ac7eb12e5818530b8b093823a6ed13d76a6a2dc4b6d83e7b4f58fec9603d911c',
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
                    polltaker_account: '0xE0a68584111D702a141beCB6692631F1Dae4711f',
                    end_date: 1745180444,
                    attestation: 'ea9b4c64b0b5f03b7f435856813c9500dd4d384e17f099e8f2fb6852c4fe070c62ac7eb12e5818530b8b093823a6ed13d76a6a2dc4b6d83e7b4f58fec9603d911c',
                });
                expect(result.body.valid_event_ids).to.be.equalTo([128, 124, 127, 123, 126, 125, 129, 130]);
                expect(result.body.poll_options.length).to.equal(3);

                done();
            });
    });

    it('should not create a vote when the option does not belong to the poll', (done) => {
        const vote = {
            voter_account: "0x8f5906963Ae276E1631EFA8Ff1a9CaE6499EC5E3",
            token_ids: [6068,],
            poll_option_id: 1,
            attestation: "f88bd9bcdd42a63fe78d92180588b369d292694bca974594d60d44d97f11790e77dc3505a15fda0a52686bed6bb6d2f9cc9bc4e29e2ddd19c0d5e1f2903878e01b",
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