import chai from 'chai';
import VoteValidator from '../src/validators/VoteValidator';

const { expect } = chai;

describe('VoteValidator', () => {

    let voteData = {
        voter_account: "0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b",
        token_ids: [10, 2, 27],
        poll_option_id: 1,
    }

    let voteDataDeleting = (field) => {
        let copy = {...voteData};
        delete copy[field];
        return copy;
    }

    let voteDataReplacing = (field, newValue) => {
        let copy = {...voteData};
        copy[field] = newValue;
        return copy;
    }

    it('should fail without all required fields', () => {
        const required_fields = ["voter_account", "token_ids", "poll_option_id", ];

        required_fields.forEach((field) => {
            const validation = VoteValidator.validateCreate(voteDataDeleting(field));
            expect(validation.isValid).is.false;
            expect(validation.errorMessage).is.not.null;
        });
    });

    it('should fail an invalid address checksum', () => {
        const validation = VoteValidator.validateCreate(voteDataReplacing('voter_account', '0x22d491Bde2303f2f43325B2108D26f1eAbA1e32b'));
        expect(validation.isValid).is.false;
        expect(validation.errorMessage).to.equal('Ethereum address is improperly formed');
    });

    it('should succeed with all data present', () => {
        const validation = VoteValidator.validateCreate(voteData);
        expect(validation.isValid).to.equal(true);
    });
});
