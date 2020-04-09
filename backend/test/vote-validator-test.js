import chai from 'chai';
import VoteValidator from '../src/validators/VoteValidator';

const { expect } = chai;

describe('VoteValidator', () => {

    let voteData = {
        voter_account: "0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF",
        token_ids: [10, 2, 27],
        poll_option_id: 1,
    }

    let voteDataDeleting = (field) => {
        let copy = {...voteData};
        delete copy[field];
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

    it('should succeed with all data present', () => {
        const validation = VoteValidator.validateCreate(voteData);
        expect(validation.isValid).to.equal(true);
    });
});
