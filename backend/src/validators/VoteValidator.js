import isValidAddress from "../utils/isValidAddress";

class VoteValidator {

    static validateCreateData(voteData, pollData) {
        const fieldValidation = this.validateFields(voteData);
        if (!fieldValidation.isValid) {
            return fieldValidation;
        }

        if (!isValidAddress(voteData.voter_account)) {
            return {
                isValid: false,
                errorMessage: 'Ethereum address is improperly formed',
            }
        }

        const optionsValidation = this.validateOptionsForPoll(voteData, pollData);
        if (!optionsValidation.isValid) {
            return optionsValidation;
        }

        return {
            isValid: true,
            errorMessage: null,
        }
    }

    static validateFields(voteData) {
        const required_fields = ["voter_account", "token_ids", "poll_option_id", ];

        for (let i = 0; i < required_fields.length; i++) {
            const field = required_fields[i];

            if (!voteData[field]) {
                return {
                    isValid: false,
                    errorMessage: "Missing required vote data fields",
                };
            }
        }

        return {
            isValid: true,
            errorMessage: null,
        };
    }

    static validateOptionsForPoll(voteData, pollData) {
        voteData.poll_option_id;

        for (let i = 0; i < pollData.poll_options.length; i++) {
            const option = pollData.poll_options[i];

            if (option.id === voteData.poll_option_id) {
                return {
                    isValid: true,
                    errorMessage: null,
                };
            }
        }

        return {
            isValid: false,
            errorMessage: "Option selected does not belong to this poll",
        };
    }

    static validateVoteTokens(voteData, accountTokens) {
        const ownershipValidation = this.validateTokenOwnership(voteData, accountTokens);

        if (!ownershipValidation.isValid) {
            return ownershipValidation;
        }

        return {
            isValid: true,
            errorMessage: null,
        }
    }

    static validateTokenOwnership(voteData, accountTokens) {
        const accountTokenIds = accountTokens.map( (token) => {
            if (!token.tokenId) {
                return null;
            }

            return parseInt(token.tokenId);
        });

        for (let i = 0; i < voteData.token_ids.length; i++) {
            const tokenId = voteData.token_ids[i];

            if (!accountTokenIds.includes(tokenId)) {
                return {
                    isValid: false,
                    errorMessage: `Token not held by voting account ${tokenId}`,
                }
            }
        }

        return {
            isValid: true,
            errorMessage: null,
        }
    }
}

export default VoteValidator;
