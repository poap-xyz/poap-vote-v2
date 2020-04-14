import { ethers } from 'ethers';

const jsonFetch = (url) => fetch(url).then((res) => res.json());

export async function setEthereumData({ commit }, provider) {
  // Get user's wallet info
  const ethersProvider = new ethers.providers.Web3Provider(provider);
  const signer = ethersProvider.getSigner();
  const userAddress = await signer.getAddress();

  // Get user's POAP tokens
  const poapTokensUrl = `https://api.poap.xyz/actions/scan/${userAddress}`;
  const tokens = await jsonFetch(poapTokensUrl);

  // Commit all state changes simultaneously to avoid UI inconsistencies
  commit('setWallet', {
    signer, provider, ethersProvider, userAddress,
  });
  commit('setTokens', tokens);
}
