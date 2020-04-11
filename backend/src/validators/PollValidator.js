import SignatureHelpers from "../utils/SignatureHelpers";
import { ethers } from 'ethers';

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
        let digest = SignatureHelpers.getDigestFromPollData(digestPollData);
        console.log("DIGEST", digest);

        let signer = ethers.utils.verifyMessage(digest, `0x${signature}`);
        console.log("SIGNER", signer);

        // const r = `0x${signature.substring(0, 64)}`;
        // const s = `0x${signature.substring(64, 128)}`;
        // const v = parseInt(signature.substring(128, 130), 16);

        // console.log("r", r);
        // console.log("s", s);
        // console.log("v", v);

        return {
            isValid: true,
            errorMessage: null,
        }
    }
}

export default PollValidator;
