<template>
  <div
    v-if="poll"
    class="poll-header-wrapper"
  >
    <!--End date / time remaining -->
    <div class="poll-header-time text-subtitle2 q-pb-md">
      <div class="time-info-container">
        <little-badge
          v-if="!isMobile"
          :poll-type="timeRemaining !== 0 ? 'activePolls' : 'completedPolls'"
        />
        <p
          v-if="timeRemaining !== 0"
          class="small-text dark-grey-text no-margin"
        >
          <span v-if="!isMobile">
            This voting ends on
          </span>
          <span v-if="!isMobile">
            {{ secondsToFormattedDate(poll.end_date) }} -
          </span>
          <span>
            {{ timeRemaining }} remaining
          </span>
        </p>
        <p
          v-else
          class="small-text dark-grey-text no-margin font"
        >
          This voting ended on {{ secondsToFormattedDate(poll.end_date) }}
        </p>
        <div class="progress-container">
          <q-linear-progress
            :value="getPercentagePollTime(poll.start_date, poll.end_date)"
            size="8px"
            reverse
          />
        </div>
      </div>
    </div>
    <!-- Title -->
    <h6
      v-if="pageTitle"
      class="primary-lightened-text"
      style="margin-bottom: 0; font-size: 0.9rem"
    >
      {{ pageTitle }}
    </h6>

    <h2 class="big-title text-center q-my-none primary">
      {{ poll.title }}
    </h2>

    <!-- Description -->
    <h3
      v-if="poll && poll.description"
      class="text-subtitle2 dark-grey-text q-mb-lg text-center q-px-lg text-weight-regular"
    >
      {{ poll.description }}
    </h3>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import helpers from 'src/mixins/helpers';
import LittleBadge from 'components/LittleBadge';

export default {
  name: 'PollDetailsPollHeader',

  components: {
    LittleBadge,
  },

  mixins: [helpers],

  props: {
    pageTitle: {
      type: String,
      required: false,
      default: '',
    },
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

  created() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },

  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
};
</script>

<style lang="scss">
.poll-header-wrapper {
  min-height: 211px;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid $light-grey;

  .poll-header-time {
    @media(min-width: 768px) {
      margin-bottom: 24px;
    }
  }
  h2 {
    @media(max-width: 767.98px) {
      font-size: 23px;
      line-height: 30px;
      & + h3 {
        font-size: 16px;
        line-height: 21px;
      }
    }
  }
}
.time-info-container {
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 10px;
  padding-top: 20px;
  @media(min-width: 768px) {
    grid-template-columns: auto 1fr;
    row-gap: 8px;
    align-items: center;
    padding: 16px 16px 0;
  }
  > div {
    grid-area: 2 / 1 / 3 / 2;
    @media(min-width: 768px) {
      grid-area: 2 / 1 / 3 / 3;
    }
  }
  p {
    text-align: right;
    font-weight: 500;
    @media(max-width: 767.98px) {
      font-size: 14px;
    }
    @media(max-width: 767.98px) {
      padding: 0 16px;
    }
  }
  .progress-container {
    width: calc(100% + 32px);
    margin-left: -16px;
    .q-linear-progress {
      color: $light-green !important;
    }
  }
}
.poll-completed {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 24px;
  @media (max-width: 767.98px) {
    flex-direction: column-reverse;
    p {
      text-align: center;
      &:first-child {
        margin: 0;
      }
      &:last-child {
        margin-bottom: 24px;
        @media (min-width: 768px) {
          margin: 0
        }
      }
    }
  }
}
</style>
