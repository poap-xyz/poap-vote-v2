<template>
  <div>
    <!-- Connect Wallet -->
    <div>
      <base-button
        id="button--connect-wallet"
        class="primary-btn-with-arrow"
        :full-width="fullWidth"
        :label="label"
        :loading="isLoading"
        outline
        unelevated
        background="white"
        @click="connectWallet"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Web3Modal from 'web3modal';
import helpers from 'src/mixins/helpers';
import { ethers } from 'ethers';
import WalletConnectProvider from '@walletconnect/web3-provider';

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
      default: 'Connect Wallet (Optional)',
    },

    hideIcon: {
      type: Boolean,
      required: false,
      default: false,
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
              infuraId: '7945cc1b8dc54f778f2ef9b8172bfbe7', // required
            },
          },
        };
        const web3Modal = new Web3Modal({
          providerOptions,
          theme: this.$q.dark.isActive ? 'dark' : 'light',
        });
        const provider = await web3Modal.connect();

        const ethersProvider = new ethers.providers.Web3Provider(provider);
        const signer = ethersProvider.getSigner();
        const userAddress = await signer.getAddress();

        await this.$store.dispatch('user/setEthereumData', userAddress);
      } catch (err) {
        if (typeof err === 'string') {
          if (err.toLowerCase().indexOf('modal closed by user') > -1) {
            return;
          }
        }
        this.showError(err, 'Unable to connect wallet. Please try again.');
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
