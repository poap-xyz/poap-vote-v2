import SignatureHelpers from "../utils/SignatureHelpers";
import isValidAddress from "../utils/isValidAddress";
import axios from 'axios';
import { poll } from "ethers/utils";


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
            };
        }

        if (!pollData) {
            return {
                isValid: false,
                errorMessage: 'Poll does not exist',
            };
        }

        const optionsValidation = this.validateOptionsForPoll(voteData, pollData);
        if (!optionsValidation.isValid) {
            return optionsValidation;
        }

        return {
            isValid: true,
            errorMessage: null,
        };
    }

    static async validateAddressOnPoapMobile(voterAccount, deviceUid) {
        let host = process.env.POAP_MOBILE_BACKEND_URL || '';
        let url = host + '/api/v1/check-device-address/?address=' + voterAccount + '&device_uid=' + deviceUid;

        try {
            let res = await axios.get(url);
            if(res.status === 204) {
                return {
                    isValid: true
                };
            }

        } catch (err) {
            if(err.response) {
                if(err.response.status === 400) {
                    return {
                        isValid: false,
                        errorMessage: err.response.data,
                    };
                }
            }
        }

        return {
            isValid: false,
            errorMessage: 'Invalid validation',
        };

    }

    static async validateDelegatedCreateData(voteData, pollData) {
        const fieldValidation = this.validateDelegatedFields(voteData);
        if (!fieldValidation.isValid) {
            return fieldValidation;
        }

        if (!isValidAddress(voteData.voter_account)) {
            return {
                isValid: false,
                errorMessage: 'Ethereum address is improperly formed',
            };
        }

        if (!pollData) {
            return {
                isValid: false,
                errorMessage: 'Poll does not exist',
            };
        }

        const optionsValidation = this.validateOptionsForPoll(voteData, pollData);
        if (!optionsValidation.isValid) {
            return optionsValidation;
        }

        const addressValidation = await this.validateAddressOnPoapMobile(voteData.voter_account, voteData.device_uid);
        if (!addressValidation.isValid) {
            return addressValidation;
        }

        return {
            isValid: true,
            errorMessage: null,
        };
    }

    static validateFields(voteData) {
        const required_fields = ["voter_account", "token_ids", "poll_option_id", "attestation"];

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

    static validateDelegatedFields(voteData) {
        const required_fields = ["voter_account", "token_ids", "poll_option_id", "device_uid"];

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

    static validateVoteTokens(voteData, accountTokens, pollData) {
        const ownershipValidation = this.validateTokenOwnership(voteData, accountTokens);
        if (!ownershipValidation.isValid) {
            return ownershipValidation;
        }

        const qualificationValidation = this.validateTokenQualification(voteData, accountTokens, pollData);
        if (!qualificationValidation.isValid) {
            return qualificationValidation;
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
                    errorMessage: `Token with Id ${tokenId} not held by voting account`,
                }
            }
        }

        return {
            isValid: true,
            errorMessage: null,
        }
    }

    static validateTokenQualification(voteData, accountTokens, pollData) {
        let tokenIdsToEventIds = {}

        for (let i = 0; i < accountTokens.length; i++) {
            const token = accountTokens[i];
            tokenIdsToEventIds[token.tokenId] = parseInt(token.event.id);
        }

        const validEventIds = pollData.valid_event_ids.map( id => parseInt(id) );

        for (let i = 0; i < voteData.token_ids.length; i++) {
            const voteTokenId = voteData.token_ids[i];
            const voteTokenEventId = tokenIdsToEventIds[voteTokenId];

            if (!validEventIds.includes(voteTokenEventId)) {
                return {
                    isValid: false,
                    errorMessage: `Token with Id ${voteTokenId} not qualified to vote in this poll`,
                };
            }
        }

        for (let i = 0; i < accountTokens.length; i++) {
            const ownedToken = accountTokens[i];
            const ownedTokenId = parseInt(ownedToken.tokenId);
            const ownedTokenEventId = parseInt(ownedToken.event.id);

            const isMissing = validEventIds.includes(ownedTokenEventId) && !voteData.token_ids.includes(ownedTokenId)

            if (isMissing) {
                return {
                    isValid: false,
                    errorMessage: `Qualifying token with Id ${ownedTokenId} missing from your vote`,
                };
            }
        }

        return {
            isValid: true,
            errorMessage: null,
        };
    }

    static validateSignature(voteData) {
        const signature = voteData.attestation;

        if (130 !== signature.length) {
            return {
                isValid: false,
                errorMessage: "Improperly formed signature",
            };
        }

        let digestVoteData = {...voteData};
        delete digestVoteData.attestation

        const dataName = 'Vote';
        const dataFormat = [
            { name: 'voter_account', type: 'address' },
            { name: 'token_ids', type: 'uint256[]' },
            { name: 'poll_option_id', type: 'uint256' },
        ];

        const recoveredAddress = SignatureHelpers.recoverSigner(signature, dataName, dataFormat, digestVoteData)

        if (recoveredAddress !== voteData.voter_account) {
            return {
                isValid: false,
                errorMessage: "Signature does not match data submitted",
            }
        }

        return {
            isValid: true,
            errorMessage: null,
        }
    }
}

export default VoteValidator;
