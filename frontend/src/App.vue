<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',

  async mounted() {
    await this.$store.dispatch('poap/getEvents');
    await this.$store.dispatch('poap/getPolls');
  },
};
</script>
