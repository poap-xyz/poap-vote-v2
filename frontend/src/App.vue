<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import helpers from 'src/mixins/helpers';

const jsonFetch = (url) => fetch(url).then((res) => res.json());

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

    const script = document.createElement('script');
    script.src = '//gc.zgo.at/count.js';
    script.async = true;
    document.getElementsByTagName('head')[0].appendChild(script);

    // Get user's POAP tokens
    if (userAddress && JSON.parse(userAddress)) {
      const poapTokensUrl = `https://api.poap.xyz/actions/scan/${JSON.parse(userAddress)}`;
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
