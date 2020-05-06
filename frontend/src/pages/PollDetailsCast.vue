<template>
  <q-page padding>
    <div style="margin:0 auto; max-width:600px;">
      <poll-details-poll-header page-title="Cast Your Vote" />
      <poll-details-poll-options
        :is-for-voting="true"
        @optionSelected="onOptionSelected"
      />
      <div class="q-mt-xl">
        <!-- Not logged in, so show login button -->
        <div
          v-if="!userAddress && isPollOngoing"
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
      <!-- Vote button -->
      <div v-if="userAddress && eligibleTokenCount !== 0">
        <base-button
          id="submitVote"
          color="primary"
          class="q-mt-lg"
          :disabled="!canUserVote"
          :loading="isVoteSubmissionLoading"
          :full-width="true"
          label="Submit vote"
          @click="submitVote"
        />
        <div
          v-if="hasUserVoted"
          class="text-center text-caption text-italic text-grey"
        >
          You have already voted in this poll
        </div>
      </div>
      <!-- Poll creator -->
      <poll-details-poll-creator />
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex';
import eip712 from 'src/mixins/eip712';
import getPollData from 'src/mixins/getPollData';
import helpers from 'src/mixins/helpers';
import voting from 'src/mixins/voting';
import ConnectWallet from 'components/ConnectWallet';
import PollDetailsPollHeader from 'components/PollDetailsPollHeader';
import PollDetailsPollOptions from 'components/PollDetailsPollOptions';
import PollDetailsValidEvents from 'components/PollDetailsValidEvents';
import PollDetailsPollCreator from 'components/PollDetailsPollCreator';

export default {
  name: 'PollDetailsCast',

  components: {
    ConnectWallet,
    PollDetailsPollHeader,
    PollDetailsPollOptions,
    PollDetailsValidEvents,
    PollDetailsPollCreator,
  },

  mixins: [eip712, getPollData, helpers, voting],

  data() {
    return {
      selectedOption: undefined,
      isVoteSubmissionLoading: undefined,
    };
  },

  computed: {
    ...mapState({
      userAddress: (state) => state.user.userAddress,
    }),
  },

  methods: {
    onOptionSelected(id) {
      this.selectedOption = id;
    },

    async submitVote() {
      /* eslint-disable no-console */
      let response;
      try {
        if (!this.canUserVote) return;
        this.isVoteSubmissionLoading = true;

        // Define EIP-712 signature format for submitting votes
        const dataFormat = [
          { name: 'voter_account', type: 'address' },
          { name: 'token_ids', type: 'bytes32' },
          { name: 'poll_option_id', type: 'uint256' },
        ];

        // The actual data to be signed
        const voteData = {
          voter_account: this.userAddress,
          token_ids: this.userEligibleNftIds,
          poll_option_id: this.selectedOption,
        };

        // Format data and get user's signature
        const signature = await this.getSignature('Vote', dataFormat, voteData, this.userAddress);

        // Generate object to send to server
        const payload = {
          ...voteData,
          attestation: signature,
        };
        console.log('Server payload: ', payload);

        // Submit vote
        console.log('Sending POST request to server to submit vote...');
        response = await this.$serverApi.post(`/api/poll/${this.selectedPollId}/votes`, payload);
        console.log('Server response: ', response);

        // Notify user vote submission was successful
        this.notifyUser('positive', 'Your vote has been successfully recorded!');
      } catch (err) {
        this.isVoteSubmissionLoading = false;
        this.showError(err, 'Unable to cast vote, please try again');
      }

      if (response.data) {
        try {
          await this.getSelectedPollData(true);
          this.$router.push({ name: 'results', params: { id: this.selectedPollId } });
        } catch (err) {
          this.isVoteSubmissionLoading = false;
          this.showError(err, 'Unable to get updated poll data. Please refresh the page and try again');
        }
      }
      this.isVoteSubmissionLoading = false;
    },
  },

};
</script>
