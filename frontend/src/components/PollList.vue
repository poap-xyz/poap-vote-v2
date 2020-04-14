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
              v-for="event in poll.valid_event_ids"
              :key="event"
            >
              {{ event }}
            </div>
          </div>
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
      polls(state) {
        return state.poap[this.pollType];
      },
    }),

    prettyHeader() {
      if (this.pollType.toLowerCase().startsWith('active')) return 'Active Polls';
      return 'Completed Polls';
    },
  },
};
</script>
