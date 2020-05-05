<template>
  <div
    v-if="isLoading"
    class="row justify-center q-my-xl q-py-xl"
  >
    <q-spinner
      color="primary"
      size="3rem"
    />
    <div class="col-xs-12 text-center text-italic q-mt-lg">
      Loading polls...
    </div>
  </div>
  <div
    v-else
    class="q-mb-xl q-pb-xl"
  >
    <poll-list poll-type="activePolls" />
    <poll-list poll-type="completedPolls" />
  </div>
</template>

<script>
import PollList from 'components/PollList';
import helpers from 'src/mixins/helpers';

export default {
  name: 'PollListAllPolls',

  components: {
    PollList,
  },

  mixins: [helpers],

  data() {
    return {
      isLoading: undefined,
    };
  },

  async mounted() {
    try {
      this.isLoading = true;
      await this.$store.dispatch('poap/getPolls');
      this.isLoading = false;
    } catch (err) {
      this.showError(err, 'Unable to fetch polls. Please refresh the page and try again.');
    }
  },
};
</script>
