<template>
  <div>
    <!-- Connect Wallet -->
    <div>
      <base-button
        label="Connect Wallet"
        color="primary"
        :loading="isLoading"
        @click="connectWallet"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Onboard from 'bnc-onboard';

let provider;
const wallets = [
  { walletName: 'metamask' },
  { walletName: 'torus' },
  { walletName: 'fortmatic', apiKey: process.env.FORTMATIC_API_KEY },
  { walletName: 'walletConnect', infuraKey: process.env.INFURA_ID },
  { walletName: 'portis', apiKey: process.env.PORTIS_API_KEY },
  { walletName: 'authereum' },
  // Squarelink site would not load to get API key, so leaving out for now
  // { walletName: 'squarelink', apiKey: process.env.SQUARELINK_API_KEY },
  { walletName: 'opera' },
  { walletName: 'dapper' },
];

export default {
  name: 'ConnectWallet',

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
        // Let user connect wallet of their choice
        this.isLoading = true;
        const onboard = Onboard({
          walletSelect: { wallets },
          dappId: process.env.BLOCKNATIVE_API_KEY,
          networkId: 1,
          darkMode: Boolean(this.$q.localStorage.getItem('isDark')),
          subscriptions: {
            wallet: (wallet) => { provider = wallet.provider; },
          },
        });
        await onboard.walletSelect();
        await onboard.walletCheck();
        // Update state with wallet info
        await this.$store.dispatch('user/setEthereumData', provider);
      } catch (err) {
        console.error(err); // eslint-disable-line no-console
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
