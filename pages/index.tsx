import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Web3AuthConfig, Web3AuthModalPack } from "@safe-global/auth-kit";
import { EthersAdapter, SafeAccountConfig, SafeFactory } from "@safe-global/protocol-kit";
import { GelatoRelayPack } from "@safe-global/relay-kit";
import { initWasm } from "@trustwallet/wallet-core";
import {
    CHAIN_NAMESPACES,
    WALLET_ADAPTERS,
    SafeEventEmitterProvider,
} from "@web3auth/base";
import { Web3AuthOptions } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { serializeError } from "eth-rpc-errors";
import { ethers } from "ethers";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";

import { baseGoerli, projectId } from "../constants/base";
import { ACTIONS, GlobalContext } from "../context/GlobalContext";
import { getStore } from "../store/GlobalStore";
import BottomSheet from "../ui_components/bottom-sheet";
import ConnectWallet from "../ui_components/connect_wallet/";
import Header from "../ui_components/header";
import HomePage from "../ui_components/home/HomePage";
import { LoadChestComponent } from "../ui_components/loadchest/LoadChestComponent";
import LoadingTokenPage from "../ui_components/loadingTokenPage";
import { useWagmi } from "../utils/wagmi/WagmiContext";
import { Wallet } from "../utils/wallet";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import {
    EthereumPrivateKeyProvider,
    EthereumPrivKeyProviderConfig,
} from "@web3auth/ethereum-provider";

export type THandleStep = {
    handleSteps: (step: number) => void;
};

export enum ESTEPS {
    ONE = 1,
    TWO = 2,
    THREE = 3,
}
export enum LOGGED_IN {
    GOOGLE = "google",
    EXTERNAL_WALLET = "external_wallet",
}

export default function Home() {
    const {
        dispatch,
        state: { loggedInVia },
    } = useContext(GlobalContext);
    const [loader, setLoader] = useState(true);
    const [openLogin, setSdk] = useState<any>("");
    const [safeLogin, setSafeLogin] = useState<any>("");
    const [walletAddress, setWalletAddress] = useState<string>("");
    const [step, setStep] = useState<number>(ESTEPS.ONE);
    const [openBottomSheet, setOpenBottomSheet] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const { getAccount, disconnect } = useWagmi();
    const { openConnectModal } = useConnectModal();
    const { address, isConnecting, isConnected } = useAccount();
    const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null);
    const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);

    useEffect(() => {
        async function initializeOpenLogin() {
            const chainConfig = {
                chainNamespace: CHAIN_NAMESPACES.EIP155,
                chainId: "0x14a33",
                rpcTarget: "https://goerli.base.org",
                displayName: "Base Goerli Testnet",
                blockExplorer: "https://goerli.basescan.org/",
                ticker: "ETH",
                tickerName: "Ethereum",
            };

            const web3auth = new Web3AuthNoModal({
                clientId:
                    "BFWg2RH35EKxZJtntj1l-G2XU8AY0l-yFgFIs9iDbgKAW45ZxE9_qfj6COAWwI-RhOs2pN6OHwgZHgtoHjOlMFM",
                web3AuthNetwork: "testnet",
                chainConfig: chainConfig,
            });

            const privateKeyProvider = new EthereumPrivateKeyProvider({
                config: {
                    chainConfig,
                },
            });

            const openloginAdapter = new OpenloginAdapter({
                // privateKeyProvider: {
                //     provider: provider,
                //     currentChainConfig: chainConfig,
                // },
                adapterSettings: {
                    uxMode: "popup",
                    loginConfig: {
                        google: {
                            name: "Name of your choice",
                            verifier: "micropay",
                            typeOfLogin: "google",
                            clientId:
                                "97006979879-hpprsfnk927avhc0368fvbqjra6h5c4t.apps.googleusercontent.com",
                        },
                    },
                },
                privateKeyProvider,
            });

            web3auth.configureAdapter(openloginAdapter);
            setWeb3auth(web3auth);

            await web3auth.init();
            setProvider(web3auth.provider);

            // const options: Web3AuthOptions = {
            //     clientId:
            //         "BGYt14IfWWn05BWMxtbsTx9SLMkuU1RJmj08ISnj0sTrO9fie5r-IZt7oh0jpqn5GrkZFWqqX6okxHCJEfYJ_uI",
            //     web3AuthNetwork: "testnet",
            //     chainConfig: {
            //         chainNamespace: CHAIN_NAMESPACES.EIP155,
            //         chainId: "0x14a33",
            //         rpcTarget: "https://goerli.base.org",
            //     },
            //     uiConfig: {
            //         appName: "MicroPay",
            //         theme: "dark",
            //         loginMethodsOrder: ["google", "facebook"],
            //     },
            // };

            // const modalConfig = {
            //     // Disable Wallet Connect V2
            //     [WALLET_ADAPTERS.WALLET_CONNECT_V2]: {
            //         label: "wallet_connect",
            //         showOnModal: false,
            //     },
            //     // Disable Metamask
            //     [WALLET_ADAPTERS.METAMASK]: {
            //         label: "metamask",
            //         showOnModal: false,
            //     },
            //     [WALLET_ADAPTERS.OPENLOGIN]: {
            //         label: "openlogin",
            //         loginMethods: {
            //             sms_passwordless: {
            //                 name: "sms_passwordless",
            //                 showOnModal: false,
            //             },
            //         },
            //     },
            //     [WALLET_ADAPTERS.TORUS_EVM]: {
            //         label: "torus",
            //         showOnModal: false,
            //     },
            //     [WALLET_ADAPTERS.METAMASK]: {
            //         label: "metamask",
            //         showOnDesktop: false,
            //         showOnMobile: false,
            //     },
            // };

            // const web3AuthConfig: Web3AuthConfig = {
            //     txServiceUrl: "https://safe-transaction-goerli.safe.global",
            // };
            // // Instantiate and initialize the pack
            // const web3AuthModalPack = new Web3AuthModalPack(web3AuthConfig);
            // await web3AuthModalPack.init({ options, modalConfig });
            // setSafeLogin(web3AuthModalPack);
        }

        initializeOpenLogin();
    }, []);

    useEffect(() => {
        if (isConnected && address && localStorage.getItem("isGoogleLogin") === "false") {
            dispatch({
                type: ACTIONS.SET_ADDRESS,
                payload: address,
            });
            dispatch({
                type: ACTIONS.LOGGED_IN_VIA,
                payload: LOGGED_IN.EXTERNAL_WALLET,
            });
            setWalletAddress(address);
            setStep(ESTEPS.THREE);
        }
    }, [isConnected, address]);

    useEffect(() => {
        console.log(loggedInVia, "login in via");
        if (
            localStorage.getItem("isConnected") === "true" &&
            address &&
            localStorage.getItem("isGoogleLogin") === "false"
        ) {
            dispatch({
                type: ACTIONS.SET_ADDRESS,
                payload: address,
            });
            dispatch({
                type: ACTIONS.LOGGED_IN_VIA,
                payload: LOGGED_IN.EXTERNAL_WALLET,
            });
            setWalletAddress(address);
            setStep(ESTEPS.THREE);
        }
    }, []);

    useEffect(() => {
        if (
            localStorage.getItem("isConnected") === "true" &&
            localStorage.getItem("isGoogleLogin") === "true" &&
            safeLogin
        ) {
            signIn();
        }
    }, [safeLogin]);

    useEffect(() => {
        if (googleSignInStarted) {
            signIn();
        }
    }, [safeLogin]);

    const [googleSignInStarted, setGoogleSignInStarted] = useState(false);

    const signIn = async () => {
        // setGoogleSignInStarted(true);
        // if (safeLogin) {
        //     const authKitSignData = await safeLogin.signIn();
        //     localStorage.setItem("isConnected", "true");
        //     localStorage.setItem("isGoogleLogin", "true");
        //     // await deploySafeContract();
        //     dispatch({
        //         type: ACTIONS.LOGGED_IN_VIA,
        //         payload: LOGGED_IN.GOOGLE,
        //     });
        //     dispatch({
        //         type: ACTIONS.SET_ADDRESS,
        //         payload: authKitSignData.eoa,
        //     });
        //     setWalletAddress(authKitSignData.eoa);
        //     handleSteps(ESTEPS.THREE);
        //     setGoogleSignInStarted(false);
        // }
        if (!web3auth) {
            console.log("web3auth not initialized yet");
            return;
        }
        const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
            loginProvider: "google",
        });
        console.log(web3authProvider, "web3 prvider");
        setProvider(web3authProvider);
    };

    const deploySafeContract = async () => {
        console.log("deploy safe contract called");
        const provider = new ethers.providers.Web3Provider(safeLogin.getProvider());
        const signer = provider.getSigner();
        console.log("deploy signer", signer);
        const ethAdapter = new EthersAdapter({
            ethers,
            signerOrProvider: signer || provider,
        });
        const safeFactory = await SafeFactory.create({ ethAdapter: ethAdapter });
        console.log("deploy safeFactory", safeFactory);
        const safeAccountConfig: SafeAccountConfig = {
            owners: [await signer.getAddress()],
            threshold: 1,
        };
        console.log("deploy safeAccountConfig", safeAccountConfig);
        const safeSdkOwnerPredicted = await safeFactory.predictSafeAddress(
            safeAccountConfig,
        );
        console.log("deploy safeSdkOwner1", safeSdkOwnerPredicted);
        const safeSdkOwner1 = await safeFactory.deploySafe({ safeAccountConfig });
        // const relayKit = new GelatoRelayPack(
        //     "qbec0fcMKxOAXM0qyxL6cDMX_aaJUmSPPAJUIEg17kU_",
        // );

        // const response = await relayKit.relayTransaction({
        //     target: "0x...", // The Safe address
        //     encodedTransaction: "0x...", // Encoded Safe transaction data
        //     chainId: "100",
        // });

        // console.log("deploy safeSdkOwner1", safeSdkOwner1);
        // const safeAddress = await safeSdkOwner1.getAddress();
        console.log("Your Safe has been deployed:");
        // console.log(`https://goerli.etherscan.io/address/${safeAddress}`);
        // console.log(`https://app.safe.global/gor:${safeAddress}`);
    };

    const getAddress = async (prvKey: string) => {
        const walletCore = await initWasm();
        const wallet = new Wallet(walletCore);
        const address = await wallet.importWithPrvKey(prvKey);
        setWalletAddress(address);
        dispatch({
            type: ACTIONS.SET_ADDRESS,
            payload: address,
        });
        setLoader(false);
    };

    const signOut = async () => {
        await safeLogin.signOut();
        localStorage.removeItem("isGoogleLogin");
        localStorage.removeItem("isConnected");
        setStep(ESTEPS.ONE);

        dispatch({
            type: ACTIONS.LOGGED_IN_VIA,
            payload: "",
        });
        dispatch({
            type: ACTIONS.LOGOUT,
            payload: "",
        });
        dispatch({
            type: ACTIONS.SET_ADDRESS,
            payload: "",
        });
        if (isConnected) {
            await disconnect();
        }
        setWalletAddress("");
        setOpenBottomSheet(false);
    };

    const handleSteps = (step: number) => {
        setStep(step);
    };

    const getUIComponent = (step: number) => {
        switch (step) {
            case ESTEPS.ONE:
                return <HomePage handleSetupChest={handleSetupChest} />;
            case ESTEPS.TWO:
                return (
                    <ConnectWallet
                        signIn={signIn}
                        handleSteps={handleSteps}
                        connectWallet={connectWallet}
                        connecting={connecting}
                    />
                );
            case ESTEPS.THREE:
                return (
                    <LoadChestComponent
                        openLogin={openLogin}
                        handleSteps={handleSteps}
                        safeLogin={safeLogin}
                    />
                );
            default:
                return <HomePage handleSetupChest={handleSetupChest} />;
        }
    };

    const handleSetupChest = async () => {
        if (walletAddress) {
            handleSteps(ESTEPS.THREE);
        } else {
            handleSteps(ESTEPS.TWO);
        }
    };
    const onHamburgerClick = () => {
        setOpenBottomSheet(true);
    };

    const connectWallet = async () => {
        setConnecting(true);
        try {
            await openConnectModal?.();
        } catch (e: any) {
            const err = serializeError(e);
            console.log(err, "err");
            setConnecting(false);
            toast.error(err.message);
            console.log(e, "error");
        }
    };

    useEffect(() => {
        if (address && !isConnecting && connecting) {
            localStorage.setItem("isConnected", "true");
            localStorage.setItem("isGoogleLogin", "false");
            dispatch({
                type: ACTIONS.SET_ADDRESS,
                payload: address,
            });
            dispatch({
                type: ACTIONS.LOGGED_IN_VIA,
                payload: LOGGED_IN.EXTERNAL_WALLET,
            });
            setConnecting(false);
            setWalletAddress(address);
            handleSteps(ESTEPS.THREE);
        }
    }, [isConnecting]);

    return (
        <>
            <Header
                walletAddress={walletAddress}
                signIn={signIn}
                step={step}
                handleSteps={handleSteps}
                onHamburgerClick={onHamburgerClick}
                signOut={signOut}
                setWalletAddress={setWalletAddress}
            />
            <div className="p-4 relative">
                <ToastContainer
                    toastStyle={{ backgroundColor: "#282B30" }}
                    className={`w-50`}
                    style={{ width: "600px" }}
                    position="bottom-center"
                    autoClose={6000}
                    hideProgressBar={true}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    theme="dark"
                />
                {getUIComponent(step)}
                <BottomSheet
                    isOpen={openBottomSheet}
                    onClose={() => {
                        setOpenBottomSheet(false);
                    }}
                    walletAddress={walletAddress}
                    signOut={signOut}
                    signIn={signIn}
                    handleSteps={handleSteps}
                />
            </div>
        </>
    );
}
