<template>
  <q-page padding>
    <the-poll-details
      :id="Number($route.params.id)"
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
