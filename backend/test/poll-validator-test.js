import chai from 'chai';
import PollValidator from '../src/validators/PollValidator';

const { expect } = chai;

describe('PollValidator', () => {

    let pollData = {
        title: 'The first cool poll',
        polltaker_account: '0xE0a68584111D702a141beCB6692631F1Dae4711f',
        description: 'This could be a very, very long amount of text if we wanted it to be I guess',
        end_date: 1745180454,
        valid_event_ids: [128, 124, 127, 123, 126, 125, 129, 130],
        poll_options: ['Yes', 'No'],
        attestation: '5a3de160a7b92170a90367ebbe76ddf10e81c126d0b13bd308f8a503a68f843e751949ee0601e8f58d26b062f8799243b2d7829c42bd63bfb0c072c8634e0d661c',
    }

    let pollDataDeleting = (field) => {
        let copy = {...pollData};
        delete copy[field];
        return copy;
    }

    let pollDataReplacing = (field, newValue) => {
        let copy = {...pollData};
        copy[field] = newValue;
        return copy;
    }

    let poapEventData = [
        {
            id: 128,
        },
        {
            id: 124,
        },
        {
            id: 127,
        },
        {
            id: 123,
        },
        {
            id: 126,
        },
        {
            id: 125,
        },
        {
            id: 129,
        },
        {
            id: 130,
        },
        {
            id: 10,
        },
        {
            id: 100,
        },
    ];

    it('should fail without all required fields', () => {
        const required_fields = ["title", "polltaker_account", "description",
                                 "end_date", "valid_event_ids", "poll_options", "attestation"];

        required_fields.forEach((field) => {
            const validation = PollValidator.validateCreate(pollDataDeleting(field), poapEventData);
            expect(validation.isValid).is.false;
            expect(validation.errorMessage).is.not.null;
        });
    });

    it('should fail when the poll end date is in the past', () => {
        const past = Math.floor(Date.now() / 1000) - 10000;
        const validation = PollValidator.validateCreate(pollDataReplacing('end_date', past), poapEventData);

        expect(validation.isValid).is.false;
        expect(validation.errorMessage).to.equal('Poll end date must be at least 1 day in the future');
    });

    it('should fail when the poll end date is not far enough in the future', () => {
        const past = Math.floor(Date.now() / 1000) + (4 * 3600);
        const validation = PollValidator.validateCreate(pollDataReplacing('end_date', past), poapEventData);

        expect(validation.isValid).is.false;
        expect(validation.errorMessage).to.equal('Poll end date must be at least 1 day in the future');
    });

    it('should fail when the poll end date is not an integer', () => {
        const dateString = (new Date(Date.now() + 10*24*3600)).toString(); // 10 days from now as string
        const validation = PollValidator.validateCreate(pollDataReplacing('end_date', dateString), poapEventData);

        expect(validation.isValid).is.false;
        expect(validation.errorMessage).to.equal('Poll end date should be a number in seconds since Unix epoch');
    });

    it('should fail when the poll end date is in milliseconds', () => {
        const milliDate = Date.now() + 10*24*3600*1000; // 10 days from now as milliseconds since epoch
        const validation = PollValidator.validateCreate(pollDataReplacing('end_date', milliDate), poapEventData);

        expect(validation.isValid).is.false;
        expect(validation.errorMessage).to.equal('Poll end date should be a number in seconds since Unix epoch');
    });

    it('should fail with an invalid address checksum', () => {
        const validation = PollValidator.validateCreate(pollDataReplacing('polltaker_account', '0xE0a68584111d702A141beCB6692631F1Dae4711f'), poapEventData);
        expect(validation.isValid).is.false;
        expect(validation.errorMessage).to.equal('Ethereum address is improperly formed');
    });

    it('should fail if there is only one poll option', () => {
        const badPollData = pollDataReplacing('poll_options', ['The Only Poll Option']);
        const validation = PollValidator.validateCreate(badPollData, poapEventData);
        expect(validation.isValid).is.false;
        expect(validation.errorMessage).to.equal('Poll must have between 2 and 20 options');
    });

    it('should fail if poll option data is malformed', () => {
        const badPollData = pollDataReplacing('poll_options', ['', 'The other one is empty']);

        const validation = PollValidator.validateCreate(badPollData, poapEventData);
        expect(validation.isValid).is.false;
        expect(validation.errorMessage).to.equal('Poll Option contents are missing or malformed');
    });

    it('should fail if an event included does not exist', () => {
        const badPollData = pollDataReplacing('valid_event_ids', [124, 125, 10, 52]);
        const validation = PollValidator.validateCreate(badPollData, poapEventData);
        expect(validation.isValid).is.false;
        expect(validation.errorMessage).to.equal('Invalid ID in qualifying events 52');
    });

    it('should fail with an invalid attestation', () => {
        let badPollData = {...pollData};
        badPollData['attestation'] = "7474befda4d6b19f74df50d98b4c568166f621e4b5bc95ea436b03a412a6537e35faf43a7300244e5f87a5cefccbaddc9d2aaf5a405378131f07373aed2ae9d41c";

        const validation = PollValidator.validateCreate(badPollData, poapEventData);
        expect(validation.isValid).is.false;
        expect(validation.errorMessage).to.equal('Signature does not match the data submitted');
    });

    it('should fail if data has been tampered with', () => {
        let badPollData = pollDataDeleting('title');
        badPollData['title'] = "My New Title";

        const validation = PollValidator.validateCreate(badPollData, poapEventData);
        expect(validation.isValid).is.false;
        expect(validation.errorMessage).to.equal('Signature does not match the data submitted');
    });

    // TODO: Why in the world does this test fail??
    it('should fail if poll options have been tampered with', () => {
        let badPollData = pollDataReplacing('poll_options', ['Yes', 'Maybe']);
        const validation = PollValidator.validateCreate(badPollData, poapEventData);
        expect(validation.isValid).is.false;
        expect(validation.errorMessage).to.equal('Signature does not match the data submitted');
    });

    it('should succeed with all data present', () => {
        const validation = PollValidator.validateCreate(pollData, poapEventData);
        expect(validation.isValid).is.true;
    });
});
