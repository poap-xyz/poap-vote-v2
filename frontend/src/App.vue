<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',

  async mounted() {
    const isDark = this.$q.localStorage.getItem('isDark');
    this.$q.dark.set(isDark);
    this.$store.commit('user/setDarkModeStatus', isDark);
    await this.$store.dispatch('poap/getEvents');
    await this.$store.dispatch('poap/getPolls');
  },
};
</script>
