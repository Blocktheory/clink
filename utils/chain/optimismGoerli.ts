export const OptimismGoerli = {
  index: 10,
  id: "optimism-goerli",
  name: "Optimism Goerli Testnet",
  logo: "https://storage.googleapis.com/frontier-wallet/blockchains/optimism/info/logo.png",
  coinId: 420,
  symbol: "ETH",
  chainId: "420",
  chainIdHex: "0x1a4",
  decimals: 18,
  blockchain: "Ethereum",
  derivation: {
    path: "m/44'/60'/0'/0/0",
  },
  curve: "secp256k1",
  publicKeyType: "secp256k1Extended",
  explorer: {
    url: "https://goerli-optimism.etherscan.io",
    explorerName: "The OP Goerli Explorer",
    txPath: "/tx/",
    accountPath: "/address/",
  },
  info: {
    rpc: "https://optimism-goerli.publicnode.com/",
  },
};
