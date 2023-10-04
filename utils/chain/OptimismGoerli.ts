import { CHAINS_ENUMS, CHAINS_IDS } from ".";

export const OptimismGoerli = {
    index: 10,
    id: CHAINS_IDS.OPTIMISM,
    name: "OP Goerli",
    logo: "https://storage.googleapis.com/frontier-wallet/blockchains/optimism/info/logo.png",
    coinId: 8453,
    symbol: "ETH",
    chainId: "420",
    chainIdHex: "0x1a4",
    decimals: 18,
    blockchain: CHAINS_ENUMS.ETHEREUM,
    derivation: [
        {
            path: "m/44'/60'/0'/0/0",
            basePath: "m/44'/60'/${index}'/0/0",
        },
    ],
    curve: "secp256k1",
    publicKeyType: "secp256k1Extended",
    explorer: {
        url: "https://optimism-goerli.blockscout.com/",
        explorerName: "Blockscout",
        txPath: "/txs/",
        accountPath: "/address/",
    },
    info: {
        url: "https://goerli.optimism.io",
        rpc: "https://goerli.optimism.io",
    },
};
