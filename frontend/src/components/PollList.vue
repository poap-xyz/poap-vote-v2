<template>
  <div v-if="polls.length > 0">
    <div class="flex justify-between items-center poll-content">
      <h5 class="dark-grey text-bold q-mt-none q-pb-sm">
        {{ prettyHeader }}
      </h5>
      <div class="card-wrapper">
        <div
          v-for="(poll, index) in [...polls].slice(0, count)"
          :key="index"
        >
          <a
            style="text-decoration: none; color: inherit;"
            :href="destinationURL + '/' + poll.id "
          >
            <q-card
              :key="index"
              bordered
              :class="`card-border card-content
              ${poll.end_date > 0 && pollType === 'activePolls' ? 'active' : 'finishedd'}`"
            >
              <div class="card-header">
                <div class="flex justify-between items-center">
                  <little-badge :poll-type="pollType" />
                  <p
                    v-if="timeRemaining[index]"
                    class="no-margin dark-grey-text"
                  >
                    {{ timeRemaining[index] }} remaining
                  </p>
                </div>

                <!-- REMAINING METADATA -->

                <!-- Remaining time -->
                <div class="progress-bar">
                  <div
                    v-if="poll.end_date > 0 && pollType === 'activePolls'"
                    class="time-remaining"
                  >
                    <div
                      v-if="timeRemaining[index]"
                    >
                      <q-linear-progress
                        :value="getPercentagePollTime(poll.start_date, poll.end_date)"
                        reverse
                      />
                    </div>
                    <div v-else>
                      <q-spinner color="primary" />
                    </div>
                  </div>
                  <div
                    v-else
                    class="progress-bar-finished"
                  />
                </div>
              </div>

              <div class="card-body">
                <!-- POLL TITLE AND DESCRIPTION -->

                <div class="primary text-ellipsis poll-title">
                  <h3>{{ poll.title }}</h3>
                </div>

                <div
                  class="text-subtitle2 dark-grey-text description text-ellipsis"
                >
                  <span>{{ poll.description }}</span>
                </div>
              </div>

              <div class="card-footer">
                <!-- End Date -->
                <div
                  v-if="poll.end_date > 0"
                  class="text-caption end-date-container small-text"
                >
                  <p class="q-mb-sm q-ml-sm">End Date</p>
                  <p class="date">
                    {{ secondsToFormattedDate(poll.end_date).replace("@", " ") }}
                  </p>
                </div>

                <!-- List of valid event tokens -->
                <div class="events-container">
                  <h5 class="small-text dark-grey">
                    Valid event tokens
                  </h5>
                  <poap-event-group
                    :event-group="allEvents.filter((event) =>
                      poll.valid_event_ids.includes(event.id)).map((item) => ({event: item}))"
                  />
                </div>
              </div>
            </q-card>
          </a>
        </div>
      </div>
      <div
        v-if="(polls && count < polls.length)"
        class="btn-container"
      >
        <button
          class="btn-more primary"
          @click="() => loadMorePolls()"
        >
          Load more
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import helpers from 'src/mixins/helpers';
import PoapEventGroup from 'components/PoapEventGroup';
import LittleBadge from 'components/LittleBadge';

export default {
  name: 'PollList',

  components: {
    PoapEventGroup,
    LittleBadge,
  },

  mixins: [helpers],

  props: {
    pollType: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      count: 6,
    };
  },

  computed: {
    ...mapState({
      allEvents: (state) => state.poap.events,
      polls(state) {
        return state.poap[this.pollType];
      },
    }),

    events() {
      // Get list of all event IDs
      const eventIds = [];
      this.polls.forEach((poll) => eventIds.push(...poll.valid_event_ids));
      // Get an array of all events
      const eventArray = this.allEvents.filter((event) => eventIds.includes(event.id));
      // Convert to an object where Id is the key
      const eventObject = {};
      eventArray.forEach((event) => {
        eventObject[event.id] = event;
      });
      return eventObject;
    },

    timeRemaining() {
      if (!this.polls) return undefined;
      const times = this.polls.map((poll) => {
        const end = (new Date(poll.end_date)).getTime();
        // If poll has ended, time remaining is zero
        if (this.now >= end) return 0;
        // Otherwise, convert to days/hours/minutes
        const secondsRemaining = (end - this.now) / 1000;
        return this.secondsToTicker(secondsRemaining);
      });
      return times;
    },

    prettyHeader() {
      if (this.pollType.toLowerCase().startsWith('active')) return 'Active Polls';
      return 'Finished Polls';
    },
    destinationURL() {
      if (this.pollType.toLowerCase().startsWith('active')) return '/poll';
      return '/results';
    },
  },

  created() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },

  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },

  methods: {
    loadMorePolls() {
      if (this.count < this.polls.length) {
        if (this.count + 6 > this.polls.length) {
          this.count = this.polls.length;
        } else {
          this.count += 6;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.event-title {
  font-size: 1.5em;
}

.event-caption {
  color: grey;
  font-size: 1.25em;
}

.poll-content {
  .btn-container {
    margin-top: 12px;
    width: 100%;
    text-align: center;
    .btn-more {
      font-weight: 500;
      font-size: 16px;
      line-height: 21px;
      border: 0;
      background: transparent;
      padding: 0;
      text-align: center;
      cursor: pointer;
    }
  }
  > h5 {
    font-family: $secondary-font;
    font-size: 22px;
    line-height: 27px;
    letter-spacing: 0.01em;
    @media (max-width: 767.98px) {
      display: none;
    }
  }
}

.poll-title {
  width: 100%;
  height: 42px;
  margin-bottom: 8px;
  font-family: $secondary-font;
  @media (min-width: 768px) {
    height: 48px;
    width: calc(100% - 55px);
  }

  h3 {
    margin-bottom: 0;
    margin-top: 0px;
    font-size: 16px;
    line-height: 21px;
    font-weight: 700;
    height: 100%;
    @media (min-width: 768px) {
      font-size: 20px;
      line-height: 24px;
    }
  }
}

.text-subtitle2 {
  line-height: 18.23px;
  height: 36px;
}
.flex-1 {
  flex: 1
}

.text-ellipsis {
  span, h3 {
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 2;
  }
}

.card-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 16px;
  @media (min-width: 780px) {
    grid-template-columns: repeat(2, 1fr);
    column-gap: 24px;
    row-gap: 30px;
    padding-bottom: 20px;
  }
  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  .card-content {
    width: 100%;
    height: 252px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    @media (max-width: 767.98px) {
      border: 0;
    }
    @media (min-width: 768px) {
      height: 294px;
    }

    .card-header {
      padding: 15px;
      p {
        font-size: 12px;
        font-weight: 400;
        @media (min-width: 768px) {
          font-size: 14px;
          line-height: 21px;
        }
      }
      .time-remaining {
        margin-top: 11px;
        width: calc(100% + 36px);
        margin-left: -18px;
        &::v-deep .q-linear-progress {
          color: $light-green !important;
        }
        &::v-deep .q-linear-progress__track {
          background: $alternative-medium-grey !important;
          opacity: 1;
        }
      }
      .progress-bar {
        &-finished {
          height: 4px;
          width: calc(100% + 34px);
          margin-left: -17px;
          background: $alternative-medium-grey;
          margin-top: 8px;
        }
      }
    }

    .card-body {
      padding: 0 16px;
      @media (min-width: 768px) {
        padding: 0 24px;
      }
    }

    .card-footer {
      margin-top: auto;
      padding: 0 15px 9px 9px;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      @media (min-width: 768px) {
        padding: 0 17px 17px;
      }
      .events-container {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        flex: 1;
        h5 {
          margin-top: 0;
          margin-bottom: 4px;
        }
      }
    }

    .description {
      font-weight: 400;
      span {
        overflow-wrap: anywhere;
      }
      @media (min-width: 768px) {
        margin-top: 8px;
        padding-right: 24px;
      }
    }
  }

  .end-date-container {
    color: $dark-grey;
    p {
      &.date {
        margin: 0;
        color: $dark-grey;
        background: $other-light-grey;
        padding: 8px 12px;
        border-radius: 100px;
      }
    }
  }

}
</style>
