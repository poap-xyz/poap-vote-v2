<template>
  <div v-if="poll">
    <div
      v-if="!isPollOngoing"
      class="secondary text-caption text-bold"
    >
      The voting period for this poll has ended and results are final.
    </div>
    <q-card
      v-for="option in options"
      :key="option.id"
      class="option q-my-md"
      :class="{ 'user-cannot-vote': isForVoting && !canUserVote }"
    >
      <q-item
        clickable
        class="q-py-md"
        @click="selectOption(option.id)"
      >
        <q-item-section
          v-if="isForVoting && canUserVote"
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
          v-if="!isForVoting && votePercentages"
          avatar
          class="text-caption text-grey"
        >
          <q-item-label>
            {{ voteCounts[option.id] }}
            vote<span v-if="voteCounts[option.id]!==1">s</span>
          </q-item-label>
          <q-item-label>{{ formatPercent(votePercentages[option.id], 2) }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-card>
    <div
      v-if="!isForVoting"
      class="row justify-between"
    >
      <div class="col-auto text-caption text-grey">
        {{ totalVotes }} total vote<span v-if="totalVotes !== 1">s</span>
      </div>
      <div
        class="col-auto text-caption hyperlink"
        @click="showVotesByAddress = !showVotesByAddress"
      >
        Show results by
        <span v-if="showVotesByAddress">token counts</span>
        <span v-else>address</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import helpers from 'src/mixins/helpers';
import voting from 'src/mixins/voting';

export default {
  name: 'PollDetailsPollOptions',

  mixins: [helpers, voting],

  props: {
    isForVoting: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      selectedOption: undefined,
      showVotesByAddress: false, // true to show votes by account, false to show by token
    };
  },

  computed: {
    ...mapGetters({
      voteData: 'poap/voteData',
    }),
    ...mapState({
      poll: (state) => state.poap.selectedPoll,
    }),

    /**
     * @notice Based on the specific poll we are viewing, return the options as an array
     * to ensure items are in the order desired by the poll creator
     */
    options() {
      const options = this.poll.poll_options;
      return options.sort((x, y) => x.id - y.id);
    },

    totalVotes() {
      if (!this.showVotesByAddress) return this.voteData.totalVotes;
      return this.votes.length;
    },
    voteCounts() {
      if (!this.showVotesByAddress) return this.voteData.voteCounts;
      // Preallocate output so all options have a zero count
      const counts = {};
      this.options.forEach((option) => { counts[option.id] = 0; });
      // Get counts
      this.votes.forEach((vote) => { counts[vote.poll_option_id] += 1; });
      return counts;
    },
    votePercentages() {
      if (!this.showVotesByAddress) return this.voteData.votePercentages;
      // Preallocate output so all options have a zero count
      const percentages = {};
      this.options.forEach((option) => { percentages[option.id] = 0; });
      // Convert vote counts to percentages
      Object.keys(this.voteCounts).forEach((key) => {
        percentages[key] = this.voteCounts[key] / this.totalVotes;
      });
      return percentages;
    },
  },

  methods: {
    selectOption(id) {
      if (this.isForVoting && this.canUserVote) {
        this.selectedOption = id;
        this.$emit('optionSelected', id);
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.body--light {
  .option {
    background-color: $primary-lightened;
  }
}

.user-cannot-vote {
  opacity: 0.6;
}
</style>
