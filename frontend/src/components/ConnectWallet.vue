<template>
  <div>
    <!-- Connect Wallet -->
    <div>
      <base-button
        id="button--connect-wallet"
        color="primary"
        :label="label"
        :loading="isLoading"
        @click="connectWallet"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ConnectWallet',

  props: {
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
        await this.$store.dispatch('user/setEthereumData', window.ethereum);
      } catch (err) {
        console.error(err); // eslint-disable-line no-console
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
