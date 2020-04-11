class SignatureHelpers {
    static getDigestFromPollData(pollData) {
        const dataFormat = [
            { name: 'title', type: 'string' },
            { name: 'polltaker_account', type: 'address' },
            { name: 'description', type: 'string' },
            { name: 'valid_event_ids', type: 'bytes32' },
            { name: 'poll_options', type: 'string' },
            { name: 'end_date', type: 'string' },
          ];

          return this.formatSignatureData('Poll', dataFormat, pollData)
    }

    static formatSignatureData(dataName, dataFormat, dataContents) {
        const EIP712Domain = [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          // { name: 'verifyingContract', type: 'address' }, // not used
          { name: 'salt', type: 'bytes32' },
        ];

        const EIP712DomainData = {
          name: 'POAP Vote',
          version: '1',
          chainId: 1,
          // verifyingContract: '', // not used
          salt: '0xee1c0b21b9cf1f4c6cf33150f19fb69dcef673e6c92a8fe734bb2bc11150cc3',
        };

        const data = {
          types: {
            EIP712Domain,
            [dataName]: dataFormat,
          },
          domain: EIP712DomainData,
          primaryType: dataName,
          message: dataContents,
        };

        return JSON.stringify(data);
      }
}

export default SignatureHelpers;