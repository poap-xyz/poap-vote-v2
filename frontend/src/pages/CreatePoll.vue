<template>
  <q-page padding>
    <div class="text-center">
      <h2 class="primary text-bold">
        Create poll
      </h2>
      <the-create-poll-form />
    </div>
  </q-page>
</template>

<script>
import TheCreatePollForm from 'components/TheCreatePollForm';

export default {
  name: 'CreatePoll',

  components: {
    TheCreatePollForm,
  },
};
</script>
