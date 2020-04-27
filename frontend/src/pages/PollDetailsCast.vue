<template>
  <q-page padding>
    <div style="margin:0 auto; max-width:600px;">
      <poll-details-poll-header />
      <poll-details-poll-options />
      <div class="q-mt-xl">
        <!-- Not logged in, so show login button -->
        <div
          v-if="!userAddress"
          class="secondary text-bold text-center"
        >
          Voting requires a web3 connected wallet
          <connect-wallet
            :full-width="true"
            label="Connect Wallet to Vote"
          />
        </div>
        <!-- Logged in, so show valid events -->
        <div v-else>
          <poll-details-valid-events :is-for-voting="true" />
        </div>
      </div>
      <poll-details-poll-creator />
    </div>
    <!--  -->
    <the-poll-details
      :id="Number($route.params.id)"
      class="q-pb-xl"
    />
  </q-page>
</template>

<script>
import { mapState } from 'vuex';
import getPollData from 'src/mixins/getPollData';
import ConnectWallet from 'components/ConnectWallet';
import PollDetailsPollHeader from 'components/PollDetailsPollHeader';
import PollDetailsPollOptions from 'components/PollDetailsPollOptions';
import PollDetailsValidEvents from 'components/PollDetailsValidEvents';
import PollDetailsPollCreator from 'components/PollDetailsPollCreator';

import ThePollDetails from 'components/ThePollDetails';

export default {
  name: 'PollDetailsCast',

  components: {
    ConnectWallet,
    PollDetailsPollHeader,
    PollDetailsPollOptions,
    PollDetailsValidEvents,
    PollDetailsPollCreator,
    //
    ThePollDetails,
  },

  mixins: [getPollData],

  computed: {
    ...mapState({
      userAddress: (state) => state.user.userAddress,
    }),
  },

};
</script>
