<template>
  <div class="q-mb-xl q-pb-xl">
    <poll-list poll-type="activePolls" />
    <poll-list poll-type="completedPolls" />
  </div>
</template>

<script>
import PollList from 'components/PollList';

export default {
  name: 'PollListAllPolls',

  components: {
    PollList,
  },

  data() {
    return {};
  },
};
</script>
