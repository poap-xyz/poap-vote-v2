import chai from 'chai';
import VoteValidator from '../src/validators/VoteValidator';

const { expect } = chai;

describe('VoteValidator', () => {

    let voteData = {
        voter_account: "0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b",
        token_ids: [10, 2, 27],
        poll_option_id: 1,
        attestation: "a53e912e990cad3de52d38e2f7f73ba0608b327aa8dbbc41feb8bb417e9768063ad342d586ece1443cc33d3244f87f1b9c87594bb8732ac8c3470e42bd5b0f4f1b",
    }

    let pollData = {
        poll_options: [
            {
                id: 1,
                contents: 'Yes',
            },
            {
                id: 2,
                contents: 'No',
            },
        ],
        valid_event_ids: [183, 125],
    };

    let tokenData = [
        {
            "event": {
                "id": 183,
            },
            "tokenId": "10",
        },
        {
            "event": {
                "id": 125,
            },
            "tokenId": "2",
        },
        {
            "event": {
                "id": 183,
            },
            "tokenId": "27",
        },
        {
            "event": {
                "id": 6,
            },
            "tokenId": "13",
        },
    ];

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

    // CREATE VOTE DATA

    it('should fail without all required fields', () => {
        const required_fields = ["voter_account", "token_ids", "poll_option_id", ];

        required_fields.forEach((field) => {
            const validation = VoteValidator.validateCreateData(voteDataDeleting(field), pollData);
            expect(validation.isValid).is.false;
            expect(validation.errorMessage).is.not.null;
        });
    });

    it('should fail an invalid address checksum', () => {
        const validation = VoteValidator.validateCreateData(voteDataReplacing('voter_account', '0x22d491Bde2303f2f43325B2108D26f1eAbA1e32b'), pollData);
        expect(validation.isValid).is.false;
        expect(validation.errorMessage).to.equal('Ethereum address is improperly formed');
    });

    it('should fail if poll option chosen is not part of this poll', () => {
        const validation = VoteValidator.validateCreateData(voteDataReplacing('poll_option_id', 3), pollData);
        expect(validation.isValid).is.false;
        expect(validation.errorMessage).to.equal('Option selected does not belong to this poll');
    });

    it('should succeed with all data present', () => {
        const validation = VoteValidator.validateCreateData(voteData, pollData);
        expect(validation.isValid).to.be.true;
    });

    // CREATE VOTE TOKENS

    it('should fail if not all qualifying tokens are being used to vote', () => {
        const badVoteData = voteDataReplacing('token_ids', [2, 27]);
        const validation = VoteValidator.validateVoteTokens(badVoteData, tokenData, pollData);
        expect(validation.isValid).to.be.false;
        expect(validation.errorMessage).to.equal('Qualifying token with Id 10 missing from your vote');
    });

    it('should fail if a token that is not from a qualifying event is used to vote', () => {
        const badVoteData = voteDataReplacing('token_ids', [10, 2, 27, 13]);
        const validation = VoteValidator.validateVoteTokens(badVoteData, tokenData, pollData);
        expect(validation.isValid).to.be.false;
        expect(validation.errorMessage).to.equal('Token with Id 13 not qualified to vote in this poll');
    });

    it('should fail if a token that is not owned by the account is used to vote', () => {
        const badVoteData = voteDataReplacing('token_ids', [10, 2, 27, 12]);
        const validation = VoteValidator.validateVoteTokens(badVoteData, tokenData, pollData);
        expect(validation.isValid).to.be.false;
        expect(validation.errorMessage).to.equal('Token with Id 12 not held by voting account');
    });

    it('should succeed if all token data is correct', () => {
        const validation = VoteValidator.validateVoteTokens(voteData, tokenData, pollData);
        expect(validation.isValid).to.be.true;
    });

    it('should validate a vote signature', () => {
        const signedVote = {
            voter_account: "0x8f5906963Ae276E1631EFA8Ff1a9CaE6499EC5E3",
            token_ids: [6068, 5378],
            poll_option_id: 10,
            attestation: "a53e912e990cad3de52d38e2f7f73ba0608b327aa8dbbc41feb8bb417e9768063ad342d586ece1443cc33d3244f87f1b9c87594bb8732ac8c3470e42bd5b0f4f1b",
        }

        const validation = VoteValidator.validateSignature(signedVote);
        expect(validation.isValid).to.be.true;
    });
});
