/**
 * @notice This mixin will do the following:
 *   - On page load, check if ID of selected poll matches URL. If so, load that data
 *   - If not, fetch the data and save it to the store
 */
import { mapState } from 'vuex';

export default {
  data() {
    return {
      isPollDataLoading: undefined,
      selectedPollId: undefined,
    };
  },

  computed: {
    ...mapState({
      poll: (state) => state.poap.selectedPoll,
    }),
  },

  async mounted() {
    this.isPollDataLoading = true;
    await this.getSelectedPollData();
    this.isPollDataLoading = false;
  },

  methods: {
    /**
     * @notice Get poll details and votes
     * @param {Boolean} forceFetch true to fetch data, used after placing a vote
     */
    async getSelectedPollData(forceFetch = false) {
      this.selectedPollId = Number(this.$route.params.id);
      if (forceFetch || !this.poll || this.poll.id !== this.selectedPollId) {
        await this.$store.dispatch('poap/getSelectedPoll', this.selectedPollId);
      }
    },
  },
};
