/**
 * @notice This mixin contains boilerplate to facilitate the signing of
 * EIP-712 compliant signatures. References:
 *   https://github.com/ethereum/EIPs/blob/master/EIPS/eip-712.md
 *   https://medium.com/metamask/eip712-is-coming-what-to-expect-and-how-to-use-it-bb92fd1a7a26
 */

import { mapState } from 'vuex';

/**
 * @notice Define wrapper method to let us use async/await with web3
 * @dev See notes below for details on why this is necessary
 * @param {Object} params Parameters to send to the web3 send method
 */
const web3Send = (params) => new Promise(((resolve, reject) => {
  window.web3.currentProvider.send(params, (err, res) => {
    if (err) {
      return reject(err);
    }
    return resolve(res);
  });
}));

export default {

  computed: {
    ...mapState({
      signer: (state) => state.user.signer,
    }),
  },

  methods: {
    /**
     * Formats the data to be signed by the user
     * @param {Array} dataFormat Array of objects defining the structure of the
     * data to be signed
     * @param {Object} dataContents Object containing the data to be signed
     * @param {String} dataName The name of the data to be signed, e.g. Poll or Vote
     * @returns {String} Stringified object formatted according to EIP-712
     */
    formatSignatureData(dataName, dataFormat, dataContents) {
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
    },

    async getSignature(dataName, dataFormat, dataContents, user) {
      /* eslint-disable no-console */
      /**
      =================================== NOTES ON SIGNING DATA ==================================
      NOTE 1
        EIP-712 signing is not yet supported by ethers.js, so as a result we use
        web3 here. Links with details are below:
          - Original discussion: https://github.com/ethers-io/ethers.js/issues/98
          - More recent: https://github.com/ethers-io/ethers.js/issues/298
          - Open issue to support EIP-712: https://github.com/ethers-io/ethers.js/issues/687

      NOTE 2
      Not all web3 providers, including MetaMask, support the use of async/await and instead
      require callbacks. The native callback code is a bit ugly, and if you try to refactor
      it to use async/await you get the error message below. Instead, we define the
      web3Send() helper function above to let us use use async/await syntax for clarity.

        Error: The MetaMask Web3 object does not support synchronous methods like
        eth_signTypedData_v3 without a callback parameter. See
        https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#dizzy-all-async---think-of-metamask-as-a-light-client for details.

      ==============================================================================================
      */

      try {
        console.log('Formatting data to be signed');
        const data = this.formatSignatureData(dataName, dataFormat, dataContents);

        console.log('Requesting user signature...');
        const result = await web3Send({
          method: 'eth_signTypedData_v3',
          params: [user, data],
          from: user,
          id: 1,
          // TODO what value of id should we use? See below link for a starting point
          // https://twitter.com/PaulRBerg/status/1160516230698196993?s=20
        });

        console.log('Signature received!');
        const signature = result.result.substring(2);
        return signature;
      } catch (err) {
        console.log('User rejected signature');
        console.error(err);
        return undefined;
      }
      /* eslint-enable no-console */
    },
  },
};
