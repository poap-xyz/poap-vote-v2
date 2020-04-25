<template>
  <div v-if="poll">
    <!-- Title -->
    <h5 class="primary text-bold">
      {{ poll.title }}
    </h5>

    <!--End date / time remaining -->
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
    <div class="q-py-md">
      {{ poll.description }}
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import helpers from 'src/mixins/helpers';

export default {
  name: 'PollDetailsPollHeader',

  mixins: [helpers],

  data() {
    return {};
  },

  computed: {
    ...mapState({
      poll: (state) => state.poap.selectedPoll,
    }),

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
  },
};
</script>
