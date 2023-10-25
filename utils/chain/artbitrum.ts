export const Arbitrum = {
  index: 10,
  id: "arbitrum",
  name: "Arbitrum",
  logo: "https://storage.googleapis.com/frontier-wallet/blockchains/arbitrum/info/logo.png",
  coinId: 8453,
  symbol: "ETH",
  chainId: "42161",
  chainIdHex: "0xa4b1",
  decimals: 18,
  blockchain: "Ethereum",
  derivation: {
    path: "m/44'/60'/0'/0/0",
  },
  curve: "secp256k1",
  publicKeyType: "secp256k1Extended",
  explorer: {
    url: "https://arbiscan.io",
    explorerName: "Arbitrum one Scan",
    txPath: "/tx/",
    accountPath: "/address/",
  },
  info: {
    rpc: "https://arbitrum.llamarpc.com/",
  },
};
