<template>
  <div>
    <div class="text-caption q-mt-xl">
      Poll created by {{ poll.polltaker_account }}
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
