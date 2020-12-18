<template>
  <q-page>
    <div class="layout-container">
      <shape-background
        v-if="!isMobile"
        theme="secondary"
      />
      <div>
        <back-button />
        <div
          v-if="poll"
          class="poll-result-container"
        >
          <white-container>
            <poll-details-poll-options
              :show-results="true"
            />

            <poll-details-poll-footer
              type-poll="finished"
            />
          </white-container>
        </div>

        <!-- Show valid events -->
        <poll-valid-events-collapse
          v-if="poll"
          :valid-event-count="poll.valid_event_ids && poll.valid_event_ids.length"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import getPollData from 'src/mixins/getPollData';
import helpers from 'src/mixins/helpers';
import PollDetailsPollOptions from 'components/PollDetailsPollOptions';
import ShapeBackground from 'components/ShapeBackground';
import BackButton from 'components/BackButton';
import WhiteContainer from 'components/WhiteContainer';
import PollValidEventsCollapse from 'components/PollValidEventsCollapse';
import PollDetailsPollFooter from 'components/PollDetailsPollFooter';

export default {
  name: 'PollDetailsResults',

  components: {
    PollDetailsPollOptions,
    ShapeBackground,
    BackButton,
    WhiteContainer,
    PollValidEventsCollapse,
    PollDetailsPollFooter,
  },

  mixins: [getPollData, helpers],

  data() {
    return {
      showEvents: undefined,
    };
  },

  mounted() {
    this.toggleBodyClass(true, 'poap-poll');
  },

  created() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },

  destroyed() {
    window.removeEventListener('resize', this.handleResize);
    this.toggleBodyClass(false, 'poap-poll');
  },

};
</script>

<style lang="scss" scoped>
.poll-result-container {
  @media(min-width: 768px) {
    margin-top: 48px;
  }
}
</style>
