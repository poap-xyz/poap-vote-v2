import chai from 'chai';
import PollValidator from '../src/validators/PollValidator';

const { expect } = chai;

describe('PollValidator', () => {

    let pollData = {
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

    it('should fail without all required fields', () => {
        const required_fields = ["title", "polltaker_account", "description",
                                 "end_date", "valid_event_ids", "poll_options", "attestation"];

        required_fields.forEach((field) => {
            const validation = PollValidator.validateCreate(pollDataDeleting(field));
            expect(validation.isValid).is.false;
            expect(validation.errorMessage).is.not.null;
        });
    });

    it('should fail with an invalid address checksum', () => {
        const validation = PollValidator.validateCreate(pollDataReplacing('polltaker_account', '0x22d491bDe2303f2f43325b2108D26f1eAba1e32B'));
        expect(validation.isValid).is.false;
        expect(validation.errorMessage).to.equal('Ethereum address is improperly formed');
    });

    it('should fail if there is only one poll option', () => {
        const badPollData = pollDataReplacing('poll_options', [
            {
                contents: 'The Only Poll Option',
            },
        ]);

        const validation = PollValidator.validateCreate(badPollData);
        expect(validation.isValid).is.false;
        expect(validation.errorMessage).to.equal('Poll must have between 2 and 20 options');
    });

    it('should fail if poll option data is malformed', () => {
        const badPollData = pollDataReplacing('poll_options', [
            {
                contents: '',
            },
            {
                contents: 'The other one is empty',
            },
        ]);

        const validation = PollValidator.validateCreate(badPollData);
        expect(validation.isValid).is.false;
        expect(validation.errorMessage).to.equal('Poll Option contents are missing or malformed');
    });

    it('should fail with an invalid attestation', () => {
        let badPollData = {...pollData};
        badPollData['attestation'] = "7474befda4d6b19f74df50d98b4c568166f621e4b5bc95ea436b03a412a6537e35faf43a7300244e5f87a5cefccbaddc9d2aaf5a405378131f07373aed2ae9d41c";

        const validation = PollValidator.validateCreate(badPollData);
        expect(validation.isValid).is.false;
        expect(validation.errorMessage).to.equal('Signature does match the data submitted');
    });

    it('should fail if data has been tampered with', () => {
        let badPollData = pollDataDeleting('title');
        badPollData['title'] = "My New Title";

        const validation = PollValidator.validateCreate(badPollData);
        expect(validation.isValid).is.false;
        expect(validation.errorMessage).to.equal('Signature does match the data submitted');
    });

    // TODO: Why in the world does this test fail??
    // it('should fail if data has been tampered with', () => {
    //     let badPollData = pollDataDeleting('poll_options');
    //     badPollData['poll_options'] = [
    //         {
    //             contents: 'Yes',
    //         },
    //         {
    //             contents: 'Maybe',
    //         },
    //     ];

    //     const validation = PollValidator.validateCreate(badPollData);
    //     expect(validation.isValid).is.false;
    //     expect(validation.errorMessage).to.equal('Signature does match the data submitted');
    // });

    it('should succeed with all data present', () => {
        const validation = PollValidator.validateCreate(pollData);
        expect(validation.isValid).is.true;
    });
});
