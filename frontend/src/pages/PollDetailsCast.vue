<template>
  <q-page padding>
    <div style="margin:0 auto; max-width:600px;">
      <poll-details-poll-header />
      <poll-details-poll-creator />
    </div>
    <!--  -->
    <the-poll-details
      :id="Number($route.params.id)"
      class="q-pb-xl"
    />
  </q-page>
</template>

<script>
import getPollData from 'src/mixins/getPollData';
import PollDetailsPollHeader from 'components/PollDetailsPollHeader';
import PollDetailsPollCreator from 'components/PollDetailsPollCreator';

import ThePollDetails from 'components/ThePollDetails';

export default {
  name: 'PollDetailsCast',

  components: {
    PollDetailsPollHeader,
    PollDetailsPollCreator,
    //
    ThePollDetails,
  },

  mixins: [getPollData],

};
</script>
