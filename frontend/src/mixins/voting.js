/**
 * @notice This mixin contains helper properties and methods for voting
 */
import { mapGetters, mapState } from 'vuex';

export default {
  data() {
    return {
      isPollDataLoading: undefined,
    };
  },

  computed: {
    ...mapGetters({
      events: 'poap/selectedPollEvents',
    }),

    ...mapState({
      poll: (state) => state.poap.selectedPoll,
      votes: (state) => state.poap.selectedPollVotes,
      userAddress: (state) => state.user.userAddress,
      userTokens: (state) => state.user.tokens,
    }),

    /**
     * @notice Returns an array of event IDs for which the user has a POAP token
     */
    userEventIds() {
      if (!this.userTokens) return undefined;
      return this.userTokens.map((token) => token.event.id);
    },

    /**
     * @notice Returns an array of IDs of eligible vote tokens held by user
     */
    eligibleTokens() {
      const validIds = this.poll.valid_event_ids;
      const intersection = this.userEventIds.filter((val) => validIds.includes(val));
      return intersection;
    },

    /**
     * @notice Returns number of votes user will get
     */
    eligibleTokenCount() {
      return this.eligibleTokens.length;
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
  },

  async mounted() {
    this.isPollDataLoading = true;
    const selectedId = Number(this.$route.params.id);
    if (!this.poll || this.poll.id !== selectedId) {
      await this.$store.dispatch('poap/getSelectedPoll', selectedId);
    }
    this.isPollDataLoading = false;
  },
};
