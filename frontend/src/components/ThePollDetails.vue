<template>
  <div style="margin:0 auto; max-width:600px;">
    <!-- Title -->
    <h5 class="primary text-bold">
      {{ poll.title }}
    </h5>
    <!-- Time remaining -->
    <div class="text-caption text-grey">
      <div v-if="timeRemaining === 0">
        Voting ended on {{ new Date(poll.end_date) }}
      </div>
      <div v-else>
        Voting ends on {{ new Date(poll.end_date) }}
        <br>
        {{ timeRemaining }} remaining
      </div>
    </div>

    <!-- Description -->
    <div class="primary-lightened q-py-md">
      {{ poll.description }}
    </div>

    <!-- Poll options -->
    <q-card
      v-for="option in options"
      :key="option.id"
      class="option q-my-md"
    >
      <q-card-section>
        {{ option.contents }}
      </q-card-section>
    </q-card>

    <!-- List valid events and option to connect wallet -->
    <div>
      <h6
        class="secondary"
        style="margin-bottom:0"
      >
        Valid Events
      </h6>
      <div v-if="isPollOngoing">
        You can vote in this poll if you hold any of the following POAP tokens.
        Connect your wallet to check your token balance and vote.
      </div>
      <div v-else>
        Users were eligible to vote in this poll if they held any of the following POAP tokens.
      </div>
      <div v-if="!userAddress && isPollOngoing">
        <connect-wallet label="Connect Wallet to Vote" />
      </div>
      <div class="row justify-start q-mt-md">
        <div
          v-for="event in events"
          :key="event.id"
          class="cursor-pointer q-mr-md q-mt-md"
        >
          <a
            :href="event.event_url"
            target="_blank"
            style="text-decoration: none; color: inherit;"
          >
            <q-card
              bordered
              class="card-border"
            >
              <q-item>
                <q-item-section avatar>
                  <q-avatar>
                    <img :src="event.image_url">
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ event.name }}</q-item-label>
                  <q-item-label caption>
                    <div>
                      {{ event.start_date }} &ndash; {{ event.end_date }}
                    </div>
                    <div>
                      <span v-if="event.city === 'Virtual'">Virtual</span>
                      <span v-else-if="!event.city">Not specified</span>
                      <span v-else>{{ event.city }}, {{ event.country }}</span>
                    </div>
                  </q-item-label>
                </q-item-section>
              </q-item>

            </q-card>
          </a>
        </div>
      </div>
    </div>

    <!-- Poll creator -->
    <div class="text-caption q-mt-xl">
      Poll created by {{ poll.polltaker_account }}
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ConnectWallet from 'components/ConnectWallet';
import helpers from 'src/mixins/helpers';

export default {
  name: 'ThePollDetails',

  components: {
    ConnectWallet,
  },

  mixins: [helpers],

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
      userAddress: (state) => state.user.userAddress,
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

    /**
     * @notice Based on the specific poll we are viewing, return the options as an array
     * to ensure items are in the order desired by the poll creator
     */
    options() {
      const options = this.poll.poll_options;
      return options.sort((x, y) => x.id - y.id);
    },

    /**
     * @notice Time remaining until the poll ends
     */
    timeRemaining() {
      const now = (new Date()).getTime();
      const end = (new Date(this.poll.end_date)).getTime();
      // If poll has ended, time remaining is zero
      if (now >= end) return 0;
      // Otherwise, convert to days/hours/minutes
      const secondsRemaining = (end - now) / 1000;
      return this.secondsToTicker(secondsRemaining);
    },

    /**
     * @notice Convert timeRemaining into a bool for convenience
     */
    isPollOngoing() {
      return this.timeRemaining !== 0;
    },
  },
};
</script>

<style lang="stylus" scoped>
.option {
  background-color: $primary-lightened
}
</style>
