import "react-toastify/dist/ReactToastify.css";
import { serializeError } from "eth-rpc-errors";
import React, { useContext, useEffect, useMemo, useState } from "react";
import HomePage from "../ui_components/home/HomePage";
import ConnectWallet from "../ui_components/connect_wallet/";
import "./globals.css";
import { baseGoerli, projectId } from "../constants/base";
import { Wallet } from "../utils/wallet";
import { initWasm } from "@trustwallet/wallet-core";
import { LoadChestComponent } from "../ui_components/loadchest/LoadChestComponent";
import Header from "../ui_components/header";
import BottomSheet from "../ui_components/bottom-sheet";
import LoadingTokenPage from "../ui_components/loadingTokenPage";
import { getStore } from "../store/GlobalStore";
import { ACTIONS, GlobalContext } from "../context/GlobalContext";
import { useWagmi } from "../utils/wagmi/WagmiContext";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { Web3AuthModalPack, Web3AuthConfig } from "@safe-global/auth-kit";
import { Web3AuthOptions } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";
import { ethers } from "ethers";
import { EthersAdapter, SafeFactory, SafeAccountConfig } from "@safe-global/protocol-kit";
import { GelatoRelayPack } from "@safe-global/relay-kit";

export type THandleStep = {
    handleSteps: (step: number) => void;
};

export enum ESteps {
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
    const [step, setStep] = useState<number>(ESteps.ONE);
    const [openBottomSheet, setOpenBottomSheet] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const { getAccount, disconnect } = useWagmi();
    const { openConnectModal } = useConnectModal();
    const { address, isConnecting, isConnected } = useAccount();

    useMemo(async () => {
        async function initializeOpenLogin() {
            // const sdkInstance = new OpenLogin({
            //     clientId: projectId,
            //     network: baseGoerli.networks.testnet.displayName,
            //     mfaSettings: undefined,
            // });
            // await sdkInstance.init();
            // if (sdkInstance.privKey) {
            //     if (localStorage.getItem("loginAttempted") === "true") {
            //         handleSteps(ESteps.THREE);
            //         localStorage.removeItem("loginAttempted");
            //     }
            //     const prvKey = sdkInstance.privKey;
            //     getAddress(prvKey);
            // } else {
            //     setLoader(false);
            // }
            // setSdk(sdkInstance);
            // dispatch({
            //     type: ACTIONS.LOGGED_IN_VIA,
            //     payload: LOGGED_IN.GOOGLE,
            // });
            // dispatch({
            //     type: ACTIONS.GOOGLE_USER_INFO,
            //     payload: {
            //         googleUserInfo: sdkInstance.state.userInfo,
            //         isConnected: sdkInstance.privKey ? true : false,
            //     },
            // });
            const options: Web3AuthOptions = {
                clientId:
                    "BGYt14IfWWn05BWMxtbsTx9SLMkuU1RJmj08ISnj0sTrO9fie5r-IZt7oh0jpqn5GrkZFWqqX6okxHCJEfYJ_uI",
                web3AuthNetwork: "testnet",
                chainConfig: {
                    chainNamespace: CHAIN_NAMESPACES.EIP155,
                    chainId: "0x14a33",
                    rpcTarget: "https://goerli.base.org",
                },
                uiConfig: {
                    appName: "MicroPay",
                    theme: "dark",
                    loginMethodsOrder: ["google", "facebook"],
                },
            };

            const modalConfig = {
                [WALLET_ADAPTERS.TORUS_EVM]: {
                    label: "torus",
                    showOnModal: false,
                },
                [WALLET_ADAPTERS.METAMASK]: {
                    label: "metamask",
                    showOnDesktop: false,
                    showOnMobile: false,
                },
            };

            const web3AuthConfig: Web3AuthConfig = {
                txServiceUrl: "https://safe-transaction-goerli.safe.global",
            };
            // Instantiate and initialize the pack
            const web3AuthModalPack = new Web3AuthModalPack(web3AuthConfig);
            await web3AuthModalPack.init({ options, modalConfig });
            setSafeLogin(web3AuthModalPack);
            console.log(
                localStorage.getItem("isConnected") === "true",
                localStorage.getItem("isGoogleLogin") === "true",
                "sa;fksd;fsa;kj",
            );
        }
        initializeOpenLogin();
    }, []);

    useMemo(async () => {
        if (isConnected && address && localStorage.getItem("isGoogleLogin") === "false") {
            dispatch({
                type: ACTIONS.SET_ADDRESS,
                payload: address,
            });
            dispatch({
                type: ACTIONS.LOGGED_IN_VIA,
                payload: LOGGED_IN.EXTERNAL_WALLET,
            });
            setWalletAddress(address!);
            setStep(ESteps.THREE);
        }
    }, [address]);

    useMemo(async () => {
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
            setWalletAddress(address!);
            setStep(ESteps.THREE);
        }
        // else if (
        //     localStorage.getItem("isConnected") === "true" &&
        //     localStorage.getItem("isGoogleLogin") === "true"
        // ) {
        //     if (safeLogin) {
        //         signIn();
        //     }
        // }
    }, []);

    // const { dispatch } = getStore();
    // setTimeout(function () {
    //     dispatch({
    //         type: ACTIONS.GOOGLE_USER_INFO,
    //         payload: {
    //             googleUserInfo: openLogin.state,
    //         },
    //     });
    // }, 200);

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
        // localStorage.setItem("loginAttempted", "true");
        // try {
        //     await openLogin.login({
        //         loginProvider: "google",
        //         redirectUrl: `${window.origin}`,
        //         mfaLevel: "none",
        //     });
        // } catch (error) {
        //     console.log("error", error);
        // }
        // setOpenBottomSheet(false);
        setGoogleSignInStarted(true);
        if (safeLogin) {
            const authKitSignData = await safeLogin.signIn();
            localStorage.setItem("isConnected", "true");
            localStorage.setItem("isGoogleLogin", "true");
            // await deploySafeContract();
            dispatch({
                type: ACTIONS.LOGGED_IN_VIA,
                payload: LOGGED_IN.GOOGLE,
            });
            dispatch({
                type: ACTIONS.SET_ADDRESS,
                payload: authKitSignData.eoa,
            });
            setWalletAddress(authKitSignData.eoa);
            handleSteps(ESteps.THREE);
            setGoogleSignInStarted(false);
        }
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
        setStep(ESteps.ONE);

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
            case ESteps.ONE:
                return <HomePage handleSetupChest={handleSetupChest} />;
            case ESteps.TWO:
                return (
                    <ConnectWallet
                        signIn={signIn}
                        handleSteps={handleSteps}
                        connectWallet={connectWallet}
                        connecting={connecting}
                    />
                );
            case ESteps.THREE:
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
            handleSteps(ESteps.THREE);
        } else {
            handleSteps(ESteps.TWO);
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
            handleSteps(ESteps.THREE);
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
