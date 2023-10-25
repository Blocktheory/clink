export const Optimism = {
  index: 10,
  id: "optimism",
  name: "Optimism",
  logo: "https://storage.googleapis.com/frontier-wallet/blockchains/optimism/info/logo.png",
  coinId: 8453,
  symbol: "ETH",
  chainId: "10",
  chainIdHex: "0xa",
  decimals: 18,
  blockchain: "Ethereum",
  derivation: {
    path: "m/44'/60'/0'/0/0",
  },
  curve: "secp256k1",
  publicKeyType: "secp256k1Extended",
  explorer: {
    url: "https://optimistic.etherscan.io",
    explorerName: "Optimism Scan",
    txPath: "/tx/",
    accountPath: "/address/",
  },
  info: {
    rpc: "https://optimism.llamarpc.com/",
  },
};
