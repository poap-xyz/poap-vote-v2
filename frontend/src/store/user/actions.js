const jsonFetch = (url) => fetch(url).then((res) => res.json());

export async function setEthereumData({ commit }, wallet) {
  // Get user's POAP tokens
  const poapTokensUrl = `https://api.poap.xyz/actions/scan/${wallet}`;
  const tokens = await jsonFetch(poapTokensUrl);

  // Commit all state changes simultaneously to avoid UI inconsistencies
  commit('setWallet', wallet);
  commit('setTokens', tokens);
}
