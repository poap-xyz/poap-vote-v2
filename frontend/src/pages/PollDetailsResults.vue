<template>
  <q-page padding>
    <div style="margin:0 auto; max-width:600px;">
      <poll-details-poll-header />
      <poll-details-poll-options />
      <poll-details-poll-creator />
    </div>
  </q-page>
</template>

<script>
import PollDetailsPollHeader from 'components/PollDetailsPollHeader';
import PollDetailsPollOptions from 'components/PollDetailsPollOptions';
import PollDetailsPollCreator from 'components/PollDetailsPollCreator';

export default {
  name: 'PollDetailsResults',

  components: {
    PollDetailsPollHeader,
    PollDetailsPollOptions,
    PollDetailsPollCreator,
  },

  data() {
    return {
      isPollDataLoading: undefined,
    };
  },

  async mounted() {
    this.isPollDataLoading = true;
    await this.$store.dispatch('poap/getSelectedPoll', Number(this.$route.params.id));
    this.isPollDataLoading = false;
  },
};
</script>
