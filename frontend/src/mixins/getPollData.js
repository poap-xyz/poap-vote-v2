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
    };
  },

  computed: {
    ...mapState({
      poll: (state) => state.poap.selectedPoll,
    }),
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
