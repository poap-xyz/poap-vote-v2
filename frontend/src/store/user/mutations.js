export function setDarkModeStatus(state, isDark) {
  state.isDark = isDark;
}

export function setWallet(state, wallet) {
  state.userAddress = wallet;
  localStorage.setItem('userAddress', JSON.stringify(wallet));
}

export function setTokens(state, tokens) {
  state.tokens = tokens;
}

export function disconnectWallet(state) {
  state.userAddress = '';
  localStorage.setItem('userAddress', JSON.stringify(''));
}
