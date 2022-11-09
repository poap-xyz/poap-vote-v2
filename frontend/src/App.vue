<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import helpers from 'src/mixins/helpers';

const poapApiUrl = 'https://api.poap.tech';
const poapApiApiKey = 'hVWzovj27w9NmjN6Vzw1Wp8rysVSnQYV06WGfMSBWRkZvSlVbadmtwSroHk4wfq9iS1J3R7rF5FxshKYEa1016XElaC6OHquA5JgYLrAwN21K1emQ1VCf08sEOR1YqLG';
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
