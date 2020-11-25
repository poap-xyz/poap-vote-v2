export default function () {
  return {
    // User settings
    isDark: undefined,
    // Wallet info
    signer: JSON.parse(localStorage.getItem('poap-signer') || '{}'),
    provider: JSON.parse(localStorage.getItem('poap-provider') || '{}'),
    ethersProvider: JSON.parse(localStorage.getItem('poap-ethersProvider') || '{}'),
    userAddress: JSON.parse(localStorage.getItem('userAddress' || '')),
    // POAP tokens
    tokens: [],
  };
}
