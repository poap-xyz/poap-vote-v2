<template>
  <q-page padding>
    <the-poll-details
      :fancy-id="$route.params.fancyId"
      class="q-pb-xl"
    />
  </q-page>
</template>

<script>
import ThePollDetails from 'components/ThePollDetails';

export default {
  name: 'PollDetails',

  components: {
    ThePollDetails,
  },
};
</script>
