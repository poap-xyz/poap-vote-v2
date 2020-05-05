<template>
  <div>
    <!-- Connect Wallet -->
    <div>
      <base-button
        id="button--connect-wallet"
        color="primary"
        :full-width="fullWidth"
        :label="label"
        :loading="isLoading"
        @click="connectWallet"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import helpers from 'src/mixins/helpers';

export default {
  name: 'ConnectWallet',

  mixins: [helpers],

  props: {
    fullWidth: {
      type: Boolean,
      required: false,
      default: false,
    },

    label: {
      type: String,
      required: false,
      default: 'Connect Wallet',
    },
  },

  data() {
    return {
      isLoading: false,
    };
  },

  computed: {
    ...mapState({
      signer: (state) => state.main.signer,
      userAddress: (state) => state.main.userAddress,
    }),
  },

  methods: {
    async connectWallet() {
      try {
        this.isLoading = true;

        const providerOptions = {
          walletconnect: {
            package: WalletConnectProvider, // required
            options: {
              infuraId: process.env.INFURA_ID, // required
            },
          },
        };
        const web3Modal = new Web3Modal({
          providerOptions,
          theme: this.$q.dark.isActive ? 'dark' : 'light',
        });
        const provider = await web3Modal.connect();

        await this.$store.dispatch('user/setEthereumData', provider);
      } catch (err) {
        this.showError(err, 'Unable to connect wallet. Please try again.');
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
