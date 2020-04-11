import SignatureHelpers from "../utils/SignatureHelpers";
import { ethers } from 'ethers';
const sigUtil = require('eth-sig-util')

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

        // Define data specific to poll creation
        // TODO: If we make dataName and dataFormat inputs to this function, we can
        // use this same function when verifying signatures from Votes as well.
        // Because 'Poll' and its dataFormat is hardcoded here, we currently cannot
        // do that.
        const dataName = 'Poll';
        const dataFormat = [
          { name: 'title', type: 'string' },
          { name: 'polltaker_account', type: 'address' },
          { name: 'description', type: 'string' },
          { name: 'valid_event_ids', type: 'bytes32' },
          { name: 'poll_options', type: 'string' },
          { name: 'end_date', type: 'string' },
        ];

        // Get the payload that was signed
        const stringifiedData = SignatureHelpers.formatSignatureData(dataName, dataFormat, digestPollData);

        // Recover the signer
        const signer = sigUtil.recoverTypedSignature({data: JSON.parse(stringifiedData), sig: `0x${signature}`});

        // Convert the returned lowercase address to a checksum address
        const checksumAddress = ethers.utils.getAddress(signer);

        console.log('------------------------ DEBUG ------------------------');
        console.log('Expected address:           ', digestPollData.polltaker_account);
        console.log('Recovered checksum address: ', signer);
        console.log('IS ADDRESS VALID: ', checksumAddress === digestPollData.polltaker_account);
        console.log('---------------------- END DEBUG ----------------------');

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
