<template>
  <div v-if="poll.polltaker_account">
    <div class="text-caption q-my-xl">
      Poll created by <a
        class="primary-lightened-text anchor"
        :href="'https://etherscan.io/address/' + poll.polltaker_account"
      >
        {{ poll.polltaker_account }}
      </a>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'PollDetailsPollCreator',

  computed: {
    ...mapState({
      poll: (state) => state.poap.selectedPoll,
    }),
  },
};
</script>

<style lang="scss" scoped>
  .anchor {
    text-decoration: none
  }
</style>
