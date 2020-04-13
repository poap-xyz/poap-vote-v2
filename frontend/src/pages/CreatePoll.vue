<template>
  <q-page padding>
    <div class="text-center">
      <h2
        id="page-title"
        class="primary text-bold"
      >
        Create Poll
      </h2>
      <div v-if="userAddress">
        <the-create-poll-form />
      </div>
      <div v-else>
        <h5 class="secondary">
          You must connect your wallet to create a poll
        </h5>
        <connect-wallet class="q-my-xl q-pt-xl" />
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex';
import ConnectWallet from 'components/ConnectWallet';
import TheCreatePollForm from 'components/TheCreatePollForm';

export default {
  name: 'CreatePoll',

  components: {
    ConnectWallet,
    TheCreatePollForm,
  },

  computed: {
    ...mapState({
      userAddress: (state) => state.user.userAddress,
    }),
  },

  created() {
    // This is an async call to the POAP API
    this.$store.dispatch('poap/getEvents');
  },
};
</script>
