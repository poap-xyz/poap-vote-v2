class PollValidator {

    static validateCreate(pollData) {
        const fieldValidation = this.validateFields(pollData);

        if (!fieldValidation.isValid) {
            return fieldValidation;
        }

        return {
            isValid: true,
            errorMessage: null,
        }
    }

    static validateFields(pollData) {
        const required_fields = ["title", "polltaker_account", "description",
                                "end_date", "valid_event_ids", "poll_options"];

        for (let i = 0; i < required_fields.length; i++) {
            const field = required_fields[i];

            if (!pollData[field]) {
                return {
                    isValid: false,
                    errorMessage: "Missing required poll data fields",
                };
            }
        }

        return {
            isValid: true,
            errorMessage: null,
        };
    }
}

export default PollValidator;
