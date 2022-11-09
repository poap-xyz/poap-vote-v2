<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import helpers from 'src/mixins/helpers';

const poapApiUrl = process.env.VUE_APP_POAP_API_URL;
const poapApiApiKey = process.env.VUE_APP_POAP_API_API_KEY;
const jsonFetch = (path) => fetch(`${poapApiUrl}${path}`, { headers: { 'x-api-key': poapApiApiKey } })
  .then((res) => res.json());

export default {
  name: 'App',

  mixins: [helpers],

  async mounted() {
    // Handle dark mode
    const isDark = this.$q.localStorage.getItem('isDark');
    this.$q.dark.set(isDark);
    this.$store.commit('user/setDarkModeStatus', isDark);

    const { userAddress } = window.localStorage;
    let tokens = [];

    // Get user's POAP tokens
    if (userAddress && JSON.parse(userAddress)) {
      const poapTokensUrl = `/actions/scan/${JSON.parse(userAddress)}`;
      tokens = await jsonFetch(poapTokensUrl);
    }
    this.$store.commit('user/setTokens', tokens);

    // Get events
    try {
      await this.$store.dispatch('poap/getEvents');
    } catch (err) {
      this.showError(err, 'Unable to fetch events. Please refresh the page and try again.');
    }
  },
};
</script>
