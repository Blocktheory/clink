export declare const OPENLOGIN_NETWORK: {
    readonly MAINNET: "mainnet";
    readonly TESTNET: "testnet";
    readonly CYAN: "cyan";
    readonly DEVELOPMENT: "development";
    readonly SK_TESTNET: "sk_testnet";
    readonly CELESTE: "celeste";
    readonly AQUA: "aqua";
};

const baseGoerli = {
    chainName: "Base Goerli",
    chainId: "84531",
    chainIdHex: "0x14a33",
    networks: {
        mainnet: { url: "", displayName: OPENLOGIN_NETWORK.MAINNET },
        devnet: { url: "", displayName: OPENLOGIN_NETWORK.DEVELOPMENT },
        testnet: {
            url: "https://solana-mainnet.g.alchemy.com/v2/GVkrt_8cLHv1Yi04m7lqZ2dbteVprcjQ",
            displayName: OPENLOGIN_NETWORK.TESTNET,
        },
    },
};

const projectId =
    "BI5-250tyqwU_79yFve_chx6hiE-f8iCxPHe0oqDpv-xU9dvGJ1p3JLo1y0AqzlMKDoZ_w0NLjxIFyNhxXJ6L6Y";

const loginProvider = {
    google: "google",
};

export { baseGoerli, loginProvider, projectId };
