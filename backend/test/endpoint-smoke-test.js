import chai from 'chai';
import chatHttp from 'chai-http';
import 'chai/register-should';
import app from '../src/index';

chai.use(chatHttp);

const { expect } = chai;

describe('Smoke Testing Endpoints', () => {

    it('should fail to create a poll missing a title', (done) => {
        const poll = {
            polltaker_account: '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b',
            description: 'This could be a very, very long amount of text if we wanted it to be I guess',
            end_date: 1587355243,
            valid_event_ids: [123, 124, 126, 129, 125],
            poll_options: [
                {
                    contents: 'Yes',
                },
                {
                    contents: 'No',
                },
            ],
            attestation: "a99cfd3da0b79606cf53c0b14c7432801d400c242bddefbec3b8356f77bbb0e05ac95430143008334b0319fca3f132533d3a86a3cd8dcc5333d1f5682793f61e1b",
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


    it('should create a poll', (done) => {
        const poll = {
            title: 'The first cool poll',
            polltaker_account: '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b',
            description: 'This could be a very, very long amount of text if we wanted it to be I guess',
            end_date: 1587355243,
            valid_event_ids: [123, 124, 126, 129, 125],
            poll_options: [
                {
                    contents: 'Yes',
                },
                {
                    contents: 'No',
                },
            ],
            attestation: "a99cfd3da0b79606cf53c0b14c7432801d400c242bddefbec3b8356f77bbb0e05ac95430143008334b0319fca3f132533d3a86a3cd8dcc5333d1f5682793f61e1b",
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
                    fancy_id: 'the-first-cool-poll',
                    polltaker_account: '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b',
                    description: 'This could be a very, very long amount of text if we wanted it to be I guess',
                    attestation: "a99cfd3da0b79606cf53c0b14c7432801d400c242bddefbec3b8356f77bbb0e05ac95430143008334b0319fca3f132533d3a86a3cd8dcc5333d1f5682793f61e1b",
                });
                expect(result.body.poll_options.length).to.equal(2);

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

    it('should fail to create a vote missing a poll option', (done) => {
        const vote = {
            voter_account: "0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF",
            token_ids: [10, 2, 27],
        };

        chai.request(app)
            .post('/api/votes/the-first-cool-poll')
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

    it('should create a vote', (done) => {
        const vote = {
            voter_account: "0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF",
            token_ids: [10, 2, 27],
            poll_option_id: 1,
        };

        chai.request(app)
            .post('/api/votes/the-first-cool-poll')
            .set('Accept', 'application/json')
            .send(vote)
            .end( (_error, result) => {
                expect(result.status).to.equal(201);
                expect(result.body).to.include({
                    id: 1,
                    poll_option_id: 1,
                });

                done();
            });
    });

    it('should return votes', (done) => {
        chai.request(app)
            .get('/api/votes/the-first-cool-poll')
            .set('Accept', 'application/json')
            .end( (_error, result) => {
                expect(result.status).to.equal(200);
                expect(result.body.length).to.equal(1);
                expect(result.body[0].poll_option_id).to.equal(1);

                done();
            });
    });

    it('should not create a poll when the attestation is a duplicate', (done) => {
        const poll = {
            title: 'The first cool poll',
            polltaker_account: '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b',
            description: 'This could be a very, very long amount of text if we wanted it to be I guess',
            end_date: 1587355243,
            valid_event_ids: [123, 124, 126, 129, 125],
            poll_options: [
                {
                    contents: 'Yes',
                },
                {
                    contents: 'No',
                },
            ],
            attestation: "a99cfd3da0b79606cf53c0b14c7432801d400c242bddefbec3b8356f77bbb0e05ac95430143008334b0319fca3f132533d3a86a3cd8dcc5333d1f5682793f61e1b",
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

    it('should create a poll when fancy id conflicts', (done) => {
        const poll = {
            title: 'The first cool poll',
            polltaker_account: '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b',
            description: 'This is actually the second first cool poll',
            end_date: 1587414034,
            valid_event_ids: [86,],
            poll_options: [
                {
                    contents: 'Yes',
                },
                {
                    contents: 'No',
                },
                {
                    contents: 'Maybe So',
                },
            ],
            attestation: '63fdad3f6b2a54b2480929d24d2e54937c09c6705a4e1ab30ba17ff7e2f0f74e7f577c09fa569ca2858b294ae196168fb4ffdc23cf40c9085e3ccf606d2b99e61c',
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
                    fancy_id: 'the-first-cool-poll-1',
                    polltaker_account: '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b',
                    description: 'This is actually the second first cool poll',
                    attestation: '63fdad3f6b2a54b2480929d24d2e54937c09c6705a4e1ab30ba17ff7e2f0f74e7f577c09fa569ca2858b294ae196168fb4ffdc23cf40c9085e3ccf606d2b99e61c',
                });
                expect(result.body.poll_options.length).to.equal(3);

                done();
            });
    });
});