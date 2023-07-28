const baseGoerli = {
    chainName: "Base Goerli",
    networks: {
        mainnet: { url: "", displayName: "mainnet" },
        devnet: { url: "", displayName: "devnet" },
        testnet: {
            url: "https://solana-mainnet.g.alchemy.com/v2/GVkrt_8cLHv1Yi04m7lqZ2dbteVprcjQ",
            displayName: "testnet",
        },
    },
};

const projectId =
    "BI5-250tyqwU_79yFve_chx6hiE-f8iCxPHe0oqDpv-xU9dvGJ1p3JLo1y0AqzlMKDoZ_w0NLjxIFyNhxXJ6L6Y";

const loginProvider = {
    google: "google",
};

export { baseGoerli, loginProvider, projectId };
