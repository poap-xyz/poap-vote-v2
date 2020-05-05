<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import helpers from 'src/mixins/helpers';

export default {
  name: 'App',

  mixins: [helpers],

  async mounted() {
    // Handle dark mode
    const isDark = this.$q.localStorage.getItem('isDark');
    this.$q.dark.set(isDark);
    this.$store.commit('user/setDarkModeStatus', isDark);

    // Get events
    try {
      await this.$store.dispatch('poap/getEvents');
    } catch (err) {
      this.showError(err, 'Unable to fetch events. Please refresh the page and try again.');
    }
  },
};
</script>
