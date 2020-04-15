<template>
  <div
    v-if="poll"
    style="margin:0 auto; max-width:600px;"
  >
    <!-- Title -->
    <h5 class="primary text-bold">
      {{ poll.title }}
    </h5>
    <!-- Time remaining -->
    <div class="text-caption text-grey">
      <div v-if="timeRemaining === 0">
        Voting ended on {{ secondsToFormattedDate(poll.end_date) }}
      </div>
      <div v-else>
        Voting ends on {{ secondsToFormattedDate(poll.end_date) }}
        <br>
        {{ timeRemaining }} remaining
      </div>
    </div>

    <!-- Description -->
    <div class="primary-lightened q-py-md">
      {{ poll.description }}
    </div>

    <!-- Poll options -->
    <q-card
      v-for="option in options"
      :key="option.id"
      class="option q-my-md"
      :class="{ 'user-cannot-vote': !canUserVote }"
    >
      <q-item
        clickable
        class="q-py-md"
        @click="canUserVote ? selectedOption=option.id : selectedOption=undefined"
      >
        <q-item-section
          v-if="canUserVote"
          avatar
        >
          <q-icon
            color="primary"
            :name="option.id === selectedOption ? 'far fa-dot-circle' : 'far fa-circle'"
          />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ option.contents }}</q-item-label>
        </q-item-section>

        <q-item-section
          v-if="votePercentages"
          avatar
          class="text-caption"
        >
          <q-item-label>{{ voteCounts[option.id] }} votes</q-item-label>
          <q-item-label>{{ formatPercent(votePercentages[option.id], 2) }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-card>
    <div class="text-caption">
      {{ totalVotes }} total votes
    </div>

    <!-- Button to vote -->
    <div v-if="userAddress">
      <base-button
        id="submitVote"
        color="primary"
        class="q-mt-lg"
        :disabled="!selectedOption"
        :loading="isLoading"
        :full-width="true"
        label="Submit vote"
        @click="submitVote"
      />
    </div>

    <!-- List valid events and option to connect wallet -->
    <div>
      <h6
        class="secondary"
        style="margin-bottom:0"
      >
        Valid Events
      </h6>
      <div v-if="isPollOngoing">
        You can vote in this poll if you hold any of the following POAP tokens.
        <span v-if="!userAddress">Connect your wallet to check your token balance and vote.</span>
        <span v-else>
          You hold {{ eligibleTokenCount }} eligible
          token<span v-if="eligibleTokenCount !== 1">s</span>
          and therefore have {{ eligibleTokenCount }}
          vote<span v-if="eligibleTokenCount !== 1">s</span>.
        </span>
      </div>
      <div v-else>
        Users were eligible to vote in this poll if they held any of the following POAP tokens.
      </div>
      <div v-if="!userAddress && isPollOngoing">
        <connect-wallet label="Connect Wallet to Vote" />
      </div>
      <div class="row justify-start q-mt-md">
        <div
          v-for="event in events"
          :key="event.id"
          class="cursor-pointer q-mr-md q-mt-md"
        >
          <a
            :href="event.event_url"
            target="_blank"
            style="text-decoration: none; color: inherit;"
          >
            <q-card
              bordered
              class="card-border"
              :class="{'not-a-user-token': !userEventIds.includes(event.id)}"
            >
              <q-item>
                <q-item-section avatar>
                  <q-avatar>
                    <img :src="event.image_url">
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ event.name }}</q-item-label>
                  <q-item-label caption>
                    <div>
                      {{ event.start_date }} &ndash; {{ event.end_date }}
                    </div>
                    <div>
                      <span v-if="event.city === 'Virtual'">Virtual</span>
                      <span v-else-if="!event.city">Not specified</span>
                      <span v-else>{{ event.city }}, {{ event.country }}</span>
                    </div>
                  </q-item-label>
                </q-item-section>
              </q-item>

            </q-card>
          </a>
        </div>
      </div>
    </div>

    <!-- Poll creator -->
    <div class="text-caption q-mt-xl">
      Poll created by {{ poll.polltaker_account }}
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ConnectWallet from 'components/ConnectWallet';
import eip712 from 'src/mixins/eip712';
import helpers from 'src/mixins/helpers';

export default {
  name: 'ThePollDetails',

  components: {
    ConnectWallet,
  },

  mixins: [eip712, helpers],

  props: {
    // This refers to the fancy ID of the poll we are viewing
    fancyId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      selectedOption: undefined,
      votes: undefined,
      isLoading: undefined,
    };
  },


  computed: {
    ...mapState({
      allEvents: (state) => state.poap.events,
      polls: (state) => [...state.poap.activePolls, ...state.poap.completedPolls],
      userAddress: (state) => state.user.userAddress,
      userTokens: (state) => state.user.tokens,
    }),

    /**
     * @notice Based on the fancyId prop, find the specific poll we are viewing
     */
    poll() {
      const polls = this.polls.filter((poll) => poll.fancy_id === this.fancyId);
      return polls[0];
    },

    /**
     * @notice Based on the specific poll we are viewing, get details for its events
     */
    events() {
      // Get list of all event IDs
      const eventIds = this.poll.valid_event_ids;
      // Get an array of all events
      const eventArray = this.allEvents.filter((event) => eventIds.includes(String(event.id)));
      return eventArray;
    },

    /**
     * @notice Based on the specific poll we are viewing, return the options as an array
     * to ensure items are in the order desired by the poll creator
     */
    options() {
      const options = this.poll.poll_options;
      return options.sort((x, y) => x.id - y.id);
    },

    /**
     * @notice Time remaining until the poll ends
     */
    timeRemaining() {
      // If poll has ended, time remaining is zero
      const end = (new Date(this.poll.end_date)).getTime();
      if (this.now >= end) return 0;
      // Otherwise, convert to days/hours/minutes
      const secondsRemaining = (end - this.now) / 1000;
      return this.secondsToTicker(secondsRemaining);
    },

    /**
     * @notice Convert timeRemaining into a bool for convenience
     */
    isPollOngoing() {
      return this.timeRemaining !== 0;
    },

    /**
     * @notice Returns an array of event IDs for which the user has a POAP token
     */
    userEventIds() {
      if (!this.userTokens) return undefined;
      return this.userTokens.map((token) => token.event.id);
    },

    /**
     * @notice Returns true if user has a least one valid POAP token for this poll
     */
    eligibleTokenCount() {
      const validIds = this.poll.valid_event_ids;
      const intersection = this.userEventIds.filter((val) => validIds.includes(String(val)));
      return intersection.length;
    },

    /**
     * @notice Returns true if user has already voted in this poll
     */
    hasUserVoted() {
      if (!this.votes) return undefined;
      const addressesThatVoted = this.votes.map((vote) => vote.voter_account);
      return addressesThatVoted.includes(this.userAddress);
    },

    /**
     * @notice Returns true if user can vote in this poll
     */
    canUserVote() {
      return this.eligibleTokenCount > 0 && !this.hasUserVoted;
    },

    /**
     * @notice Returns object where key is vote ID and value is total votes for that option
     */
    voteCounts() {
      // Get the count, i.e. number of times a vote was cast
      if (!this.votes) return undefined;
      // Get counts
      let voteArray = [];
      this.votes.forEach((vote) => {
        voteArray = [...voteArray, ...(new Array(vote.token_ids.length)).fill(vote.poll_option_id)];
      });
      const counts = voteArray.reduce((acc, val) => {
        if (acc[val] === undefined) acc[val] = 1;
        else acc[val] += 1;
        return acc;
      }, {});
      // Add missing elements (i.e. options with zero votes)
      this.poll.poll_options.forEach((option) => {
        if (!counts[option.id]) counts[option.id] = 0;
      });
      return counts;
    },

    /**
     * @notice Returns the total number of votes
     */
    totalVotes() {
      // Flatten votes into array of the option IDs amd get total number of votes
      if (!this.votes) return undefined;
      let voteArray = [];
      this.votes.forEach((vote) => {
        voteArray = [...voteArray, ...(new Array(vote.token_ids.length)).fill(vote.poll_option_id)];
      });
      return voteArray.length;
    },

    /**
     * @notice Returns object where key is vote ID is the key and value is its percentage
     */
    votePercentages() {
      // Setup output object to ensure all fields (even those with zero votes) are present
      if (!this.votes) return undefined;
      const percentages = {};
      this.poll.poll_options.forEach((option) => {
        percentages[option.id] = 0;
      });
      // Convert vote count to percentages
      Object.keys(this.voteCounts).forEach((key) => {
        percentages[key] = this.voteCounts[key] / this.totalVotes;
      });
      return percentages;
    },
  },

  async mounted() {
    const response = await this.$serverApi.get(`/api/votes/${this.fancyId}`);
    this.votes = response.data;
  },

  methods: {
    async submitVote() {
      try {
        if (!this.eligibleTokenCount || !this.selectedOption) return;
        this.isLoading = true;

        // Define EIP-712 signature format for submitting votes
        const dataFormat = [
          { name: 'voter_account', type: 'address' },
          { name: 'token_ids', type: 'bytes32' },
          { name: 'poll_option_id', type: 'uint256' },
        ];

        // The actual data to be signed
        const voteData = {
          voter_account: this.userAddress,
          token_ids: this.userTokens.map((token) => token.tokenId),
          poll_option_id: this.selectedOption,
        };
        console.log(voteData);

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
        const response = await this.$serverApi.post(`/api/votes/${this.fancyId}`, payload);
        console.log('Server response: ', response);
        this.isLoading = false;
      } catch (err) {
        console.error(err);
        this.isLoading = false;
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.option {
  background-color: $primary-lightened
}

.not-a-user-token {
  opacity: 0.6;
}

.user-cannot-vote {
  opacity: 0.6;
}
</style>
