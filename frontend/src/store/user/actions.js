const poapApiUrl = process.env.VUE_APP_POAP_API_URL;
const poapApiApiKey = process.env.VUE_APP_POAP_API_API_KEY;
const jsonFetch = (path) => fetch(`${poapApiUrl}${path}`, { headers: { 'x-api-key': poapApiApiKey } })
  .then((res) => res.json());

export async function setEthereumData({ commit }, wallet) {
  // Get user's POAP tokens
  const path = `/actions/scan/${wallet}`;
  const tokens = await jsonFetch(path);

  // Commit all state changes simultaneously to avoid UI inconsistencies
  commit('setWallet', wallet);
  commit('setTokens', tokens);
}
