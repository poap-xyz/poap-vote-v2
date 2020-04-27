<template>
  <q-page padding>
    <div class="text-center">
      <h1 class="q-mb-md">
        POAP Vote
      </h1>
      <h3 class="no-margin secondary">
        Use your POAP NFTs to vote on polls
      </h3>
    </div>
    <div class="row justify-center q-mt-xl">
      <base-button
        id="button--create-poll"
        color="primary"
        label="Create Poll"
        @click="$router.push({name: 'create'})"
      />
    </div>

    <poll-list-all-polls />
  </q-page>
</template>

<script>
import title from 'src/mixins/title';
import PollListAllPolls from 'components/PollListAllPolls';

export default {
  name: 'Home',

  components: {
    PollListAllPolls,
  },

  mixins: [title],

  mounted() {
    this.generateTitle();
  },
};
</script>
