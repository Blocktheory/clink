export const Polygon = {
  index: 3,
  id: "polygon",
  name: "Polygon",
  alias: "Matic",
  logo: "https://storage.googleapis.com/frontier-wallet/blockchains/polygon/info/logo.png",
  symbol: "MATIC",
  decimals: 18,
  chainIdHex: "0x89",
  blockchain: "Ethereum",
  derivation: [
    {
      path: "m/44'/60'/0'/0/0",
      basePath: "m/44'/60'/${index}'/0/0",
    },
  ],
  coinId: 966,
  curve: "secp256k1",
  publicKeyType: "secp256k1Extended",
  chainId: "137",
  explorer: {
    url: "https://polygonscan.com",
    explorerName: "Polygonscan",
    txPath: "/tx/",
    accountPath: "/address/",
  },
  info: {
    url: "https://polygon.technology",
    rpc: "https://polygon.llamarpc.com",
  },
};
