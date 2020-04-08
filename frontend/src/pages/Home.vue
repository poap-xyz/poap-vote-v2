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
    <div class="row justify-center">
      <q-btn
        color="primary"
        label="Create Poll"
        @click="$router.push({name: 'create'})"
      />
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'Home',
};
</script>
