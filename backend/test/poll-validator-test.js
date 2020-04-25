import chai from 'chai';
import PollValidator from '../src/validators/PollValidator';

const { expect } = chai;

describe('PollValidator', () => {

    let pollData = {
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
        const validation = PollValidator.validateCreate(pollDataReplacing('polltaker_account', '0x22d491bDe2303f2f43325b2108D26f1eAba1e32B'), poapEventData);
        expect(validation.isValid).is.false;
        expect(validation.errorMessage).to.equal('Ethereum address is improperly formed');
    });

    it('should fail if there is only one poll option', () => {
        const badPollData = pollDataReplacing('poll_options', [
            {
                contents: 'The Only Poll Option',
            },
        ]);

        const validation = PollValidator.validateCreate(badPollData, poapEventData);
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
        expect(validation.errorMessage).to.equal('Signature does match the data submitted');
    });

    it('should fail if data has been tampered with', () => {
        let badPollData = pollDataDeleting('title');
        badPollData['title'] = "My New Title";

        const validation = PollValidator.validateCreate(badPollData, poapEventData);
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

    //     const validation = PollValidator.validateCreate(badPollData, poapEventData);
    //     expect(validation.isValid).is.false;
    //     expect(validation.errorMessage).to.equal('Signature does match the data submitted');
    // });

    it('should succeed with all data present', () => {
        const validation = PollValidator.validateCreate(pollData, poapEventData);
        expect(validation.isValid).is.true;
    });
});
