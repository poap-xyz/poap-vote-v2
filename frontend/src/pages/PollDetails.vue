<template>
  <q-page padding>
    <h6 class="primary text-center">
      Poll Details Page
    </h6>
    <the-poll-details :fancy-id="$route.params.fancyId" />
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
