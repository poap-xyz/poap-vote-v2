import chai from 'chai';
import chatHttp from 'chai-http';
import 'chai/register-should';
import app from '../src/index';

chai.use(chatHttp);

const { expect } = chai;

describe('Testing the /polls endpoint', () => {

    it('should create a poll', (done) => {
        const poll = {
            title: 'The first cool poll',
        };

        chai.request(app)
            .post('/api/polls')
            .set('Accept', 'application/json')
            .send(poll)
            .end( (_error, result) => {
                expect(result.status).to.equal(201);
                expect(result.body).to.include({
                    id: 1,
                    ...poll
                });

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

                done();
            });
    });
});