<template>
  <div>
    <h5 class="secondary text-bold">
      {{ prettyHeader }}
    </h5>
    <div class="row justify-start">
      <q-card
        v-for="poll in polls"
        :key="poll.id"
        class="q-mr-md"
      >
        <!-- Poll title -->
        <q-card-section>
          <div class="text-caption text-uppercase text-grey">
            Title
          </div>
          <div>{{ poll.title }}</div>
        </q-card-section>

        <!-- Poll description -->
        <q-card-section>
          <div class="text-caption text-uppercase text-grey">
            Description
          </div>
          <div>{{ poll.description }}</div>
        </q-card-section>

        <!-- Poll end date -->
        <q-card-section>
          <div class="text-caption text-uppercase text-grey">
            End Date
          </div>
          <div>{{ new Date(poll.end_date) }}</div>
        </q-card-section>

        <!-- List of valid event tokens -->
        <q-card-section>
          <div class="text-caption text-uppercase text-grey">
            Valid Event Tokens
          </div>
          <div class="row justify-start">
            <div
              v-for="id in poll.valid_event_ids"
              :key="id"
              class="q-mr-sm"
            >
              <img
                :src="events[id].image_url"
                style="max-width:40px"
              >
              <q-tooltip>
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
        </q-card-section>

        <!-- Poll Creator -->
        <q-card-section>
          <div class="text-caption text-uppercase text-grey">
            Created By
          </div>
          <div>{{ poll.polltaker_account }}</div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'PollList',

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
      const eventArray = this.allEvents.filter((event) => eventIds.includes(String(event.id)));
      // Convert to an object where Id is the key
      const eventObject = {};
      eventArray.forEach((event) => {
        eventObject[event.id] = event;
      });
      return eventObject;
    },

    prettyHeader() {
      if (this.pollType.toLowerCase().startsWith('active')) return 'Active Polls';
      return 'Completed Polls';
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
