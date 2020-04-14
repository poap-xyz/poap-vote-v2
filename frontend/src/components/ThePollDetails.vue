<template>
  <div style="margin:0 auto; max-width:600px;">
    <h6>
      Poll Details component
    </h6>
    {{ fancyId }}
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ThePollDetails',

  props: {
    // This refers to the fancy ID of the poll we are viewing
    fancyId: {
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
      polls: (state) => [...state.poap.activePolls, ...state.poap.completedPolls],
    }),

    /**
     * @notice Based on the fancyId prop, find the specific poll we are viewing
     */
    poll() {
      const polls = this.polls.filter((poll) => poll.fancy_id === this.fancyId);
      return polls[0];
    },

    /**
     * @notice Based on the specific poll we are viewing, get details for its events
     */
    events() {
      // Get list of all event IDs
      const eventIds = this.poll.valid_event_ids;
      // Get an array of all events
      const eventArray = this.allEvents.filter((event) => eventIds.includes(String(event.id)));
      return eventArray;
    },
  },
};
</script>
