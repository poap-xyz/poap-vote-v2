class VoteValidator {

    static validateCreate(voteData) {
        const fieldValidation = this.validateFields(voteData);

        if (!fieldValidation.isValid) {
            return fieldValidation;
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
}

export default VoteValidator;
