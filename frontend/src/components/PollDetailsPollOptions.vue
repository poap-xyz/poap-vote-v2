<template>
  <div v-if="poll">
    <q-card
      v-for="option in options"
      :key="option.id"
      class="option q-my-md"
    >
      <q-item
        clickable
        class="q-py-md"
      >
        <q-item-section>
          <q-item-label>{{ option.contents }}</q-item-label>
        </q-item-section>

        <q-item-section
          v-if="votePercentages"
          avatar
          class="text-caption text-grey"
        >
          <q-item-label>{{ voteCounts[option.id] }} votes</q-item-label>
          <q-item-label>{{ formatPercent(votePercentages[option.id], 2) }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-card>
    <div class="text-caption">
      {{ totalVotes }} total vote
      <span v-if="totalVotes !== 1">s</span>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import helpers from 'src/mixins/helpers';

export default {
  name: 'PollDetailsPollOptions',

  mixins: [helpers],

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
      return this.voteData.totalVotes;
    },
    voteCounts() {
      return this.voteData.voteCounts;
    },
    votePercentages() {
      return this.voteData.votePercentages;
    },
  },
};
</script>

<style lang="stylus" scoped>
.body--light {
  .option {
    background-color: $primary-lightened
  }
}
.not-a-user-token {
  opacity: 0.6;
}
.user-cannot-vote {
  opacity: 0.6;
}
</style>
