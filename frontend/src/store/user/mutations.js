export function setDarkModeStatus(state, isDark) {
  state.isDark = isDark;
}

export function setWallet(state, wallet) {
  state.signer = wallet.signer;
  state.provider = wallet.provider;
  state.ethersProvider = wallet.ethersProvider;
  state.userAddress = wallet.userAddress;
  localStorage.setItem('poap-signer', JSON.stringify(wallet.signer));
  localStorage.setItem('poap-provider', JSON.stringify(wallet.provider));
  localStorage.setItem('poap-ethersProvider', JSON.stringify(wallet.ethersProvider));
  localStorage.setItem('userAddress', JSON.stringify(wallet.userAddress));
}

export function setTokens(state, tokens) {
  state.tokens = tokens;
}

export function disconnectWallet(state) {
  state.signer = {};
  state.provider = {};
  state.ethersProvider = {};
  state.userAddress = '';
  localStorage.setItem('poap-signer', JSON.stringify('{}'));
  localStorage.setItem('poap-provider', JSON.stringify('{}'));
  localStorage.setItem('poap-ethersProvider', JSON.stringify('{}'));
  localStorage.setItem('userAddress', JSON.stringify(''));
}
