<template>
  <q-page padding>
    <div class="text-center">
      <h1>
        POAP Vote
      </h1>
      <h2 class="secondary">
        Use your POAP NFTs to vote on polls
      </h2>
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
import PollListAllPolls from 'components/PollListAllPolls';

export default {
  name: 'Home',

  components: {
    PollListAllPolls,
  },
};
</script>
