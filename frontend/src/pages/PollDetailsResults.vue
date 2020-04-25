<template>
  <q-page padding>
    <div style="margin:0 auto; max-width:600px;">
      <poll-details-poll-header />
      <poll-details-poll-options />
      <!-- Event expansion item -->
      <div v-if="poll">
        <q-expansion-item
          v-model="showEvents"
          class="q-mt-lg"
          icon="fas fa-calendar-alt"
          :label="`Token holders from ${ poll.valid_event_ids.length }
      different events are qualified to vote in this poll.`"
          caption="Click to learn more"
        >
          <q-card>
            <q-card-section>
              <poll-details-valid-events />.
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </div>
      <poll-details-poll-creator />
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex';
import PollDetailsPollHeader from 'components/PollDetailsPollHeader';
import PollDetailsPollOptions from 'components/PollDetailsPollOptions';
import PollDetailsValidEvents from 'components/PollDetailsValidEvents';
import PollDetailsPollCreator from 'components/PollDetailsPollCreator';

export default {
  name: 'PollDetailsResults',

  components: {
    PollDetailsPollHeader,
    PollDetailsPollOptions,
    PollDetailsValidEvents,
    PollDetailsPollCreator,
  },

  data() {
    return {
      isPollDataLoading: undefined,
      showEvents: undefined,
    };
  },

  computed: {
    ...mapState({
      poll: (state) => state.poap.selectedPoll,
    }),
  },

  async mounted() {
    this.isPollDataLoading = true;
    await this.$store.dispatch('poap/getSelectedPoll', Number(this.$route.params.id));
    this.isPollDataLoading = false;
  },
};
</script>
