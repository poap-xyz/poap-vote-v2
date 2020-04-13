import SignatureHelpers from "../utils/SignatureHelpers";

class PollValidator {

    static validateCreate(pollData) {
        const fieldValidation = this.validateFields(pollData);
        if (!fieldValidation.isValid) {
            return fieldValidation;
        }

        const signatureValidation = this.validateSignature(pollData);
        if (!signatureValidation.isValid) {
            return signatureValidation;
        }

        return {
            isValid: true,
            errorMessage: null,
        }
    }

    static validateFields(pollData) {
        const required_fields = ["title", "polltaker_account", "description",
                                "end_date", "valid_event_ids", "poll_options", "attestation"];

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

    static validateSignature(pollData) {
        const signature = pollData.attestation;

        if (130 !== signature.length) {
            return {
                isValid: false,
                errorMessage: "Improperly formed signature",
            };
        }

        let digestPollData = {...pollData};
        delete digestPollData.attestation

        const dataName = 'Poll';
        const dataFormat = [
          { name: 'title', type: 'string' },
          { name: 'polltaker_account', type: 'address' },
          { name: 'description', type: 'string' },
          { name: 'valid_event_ids', type: 'bytes32' },
          { name: 'poll_options', type: 'string' },
          { name: 'end_date', type: 'string' },
        ];

        const recoveredAddress = SignatureHelpers.recoverSigner(signature, dataName, dataFormat, digestPollData)

        if (recoveredAddress !== pollData.polltaker_account) {
            return {
                isValid: false,
                errorMessage: "Signature does match the data submitted",
            }
        }

        return {
            isValid: true,
            errorMessage: null,
        }
    }
}

export default PollValidator;
