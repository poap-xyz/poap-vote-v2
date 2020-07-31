<template>
  <div v-if="polls.length > 0">
    <h5 class="secondary text-bold">
      {{ prettyHeader }}
    </h5>
    <q-virtual-scroll
      :items="polls"
      virtual-scroll-horizontal
      class="q-py-md q-pl-xs"
    >
      <template v-slot="{ item, index }">
        <a
          style="text-decoration: none; color: inherit;"
          :href="'/' + item.id + destinationURL"
        >
          <q-card
            :key="index"
            bordered
            class="card-border cursor-pointer q-mr-md"
            style="max-width: 400px; height: 100%"
          >
            <!-- POLL TITLE AND DESCRIPTION-->
            <q-card-section>
              <div class="text-h6">
                <span v-if="item.title.length < 101">{{ item.title }}</span>
                <span v-else>{{ item.title.slice(0,100) }}...</span>
              </div>
              <div>
                <span v-if="item.description.length < 101">{{ item.description }}</span>
                <span v-else>{{ item.description.slice(0,100) }}...</span>
              </div>
            </q-card-section>

            <!-- REMAINING METADATA -->
            <q-card-section>
              <!-- End Date -->
              <div class="text-caption text-uppercase text-grey">
                End Date
              </div>
              <div>
                <div>
                  {{ secondsToFormattedDate(item.end_date) }}
                </div>
                <div
                  v-if="pollType === 'activePolls' && timeRemaining[index]"
                  class="text-caption"
                >
                  {{ timeRemaining[index] }} remaining
                </div>
                <div
                  v-else-if="pollType === 'activePolls'"
                  class="text-caption"
                >
                  <q-spinner color="primary" />
                </div>

                <!-- List of valid event tokens -->
                <div class="q-mt-lg">
                  <div class="text-caption text-uppercase text-grey">
                    Valid Event Tokens
                  </div>
                  <div class="row justify-start">
                    <div
                      v-for="id in item.valid_event_ids"
                      :key="id"
                      class="q-mr-sm"
                    >
                      <img
                        :src="events[id].image_url"
                        style="max-width:40px"
                      >
                      <q-tooltip content-class="bg-white">
                        <q-card>
                          <!-- Layout copied and modified from CreatePollForm select component -->
                          <q-item-section class="dark-toggle q-pa-md">
                            <q-item-label class="event-title">
                              {{ events[id].name }}
                            </q-item-label>
                            <q-item-label class="event-caption">
                              {{ events[id].start_date }} &ndash; {{ events[id].end_date }}
                            </q-item-label>
                            <q-item-label class="event-caption">
                              <span v-if="events[id].city === 'Virtual'">Virtual</span>
                              <span v-else-if="!events[id].city">Not specified</span>
                              <span v-else>{{ events[id].city }}, {{ events[id].country }}</span>
                            </q-item-label>
                          </q-item-section>
                        </q-card>
                      </q-tooltip>
                    </div>
                  </div>
                </div>

                <!-- Poll Creator -->
                <div class="q-mt-lg">
                  <div class="text-caption text-uppercase text-grey">
                    Created By
                  </div>
                  <div>{{ item.polltaker_account }}</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </a>
      </template>
    </q-virtual-scroll>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import helpers from 'src/mixins/helpers';

export default {
  name: 'PollList',

  mixins: [helpers],

  props: {
    pollType: {
      type: String,
      required: true,
    },
  },

  data() {
    return {};
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
      return 'Completed Polls';
    },
    destinationURL() {
      if (this.pollType.toLowerCase().startsWith('active')) return '/cast';
      return '/results';
    },
  },
};
</script>

<style lang="stylus" scoped>
.event-title {
  font-size: 1.5em
}
.event-caption {
  color: grey
  font-size: 1.25em
}
</style>
