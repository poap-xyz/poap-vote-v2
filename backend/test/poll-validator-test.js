import chai from 'chai';
import PollValidator from '../src/validators/PollValidator';

const { expect } = chai;

describe('PollValidator', () => {

    let pollData = {
        title: 'The first cool poll',
        polltaker_account: '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF',
        description: 'This could be a very, very long amount of text if we wanted it to be I guess',
        end_date: new Date(),
        valid_event_ids: [1, 3, 5,],
        poll_options: [
            {
                contents: 'The first cool option',
            },
            {
                contents: 'The second cool option',
            },
        ]
    }

    let pollDataDeleting = (field) => {
        let copy = {...pollData};
        delete copy[field];
        return copy;
    }

    it('should fail without a required fields', () => {
        const required_fields = ["title", "polltaker_account", "description",
                                 "end_date", "valid_event_ids", "poll_options"];

        required_fields.forEach((field) => {
            const validation = PollValidator.validateCreate(pollDataDeleting(field));
            expect(validation.isValid).is.false;
            expect(validation.errorMessage).is.not.null;
        });
    });

    it('should succeed with all data present', () => {
        const validation = PollValidator.validateCreate(pollData);
        expect(validation.isValid).to.equal(true);
    });
});
