import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import { EthersAdapter, SafeAccountConfig, SafeFactory } from "@safe-global/protocol-kit";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider, WALLET_ADAPTERS } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { serializeError } from "eth-rpc-errors";
import React, { useContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";

import { oauthClientId, productName, web3AuthClientId, web3AuthLoginType, web3AuthVerifier } from "../constants";
import { ACTIONS, GlobalContext } from "../context/GlobalContext";
import BottomSheet from "../ui_components/bottom-sheet";
import ConnectWallet from "../ui_components/connect_wallet/";
import Footer from "../ui_components/footer";
import Header from "../ui_components/header";
import HomePage from "../ui_components/home/HomePage";
import { LoadChestComponent } from "../ui_components/loadchest/LoadChestComponent";
import { BaseGoerli } from "../utils/chain/baseGoerli";
import { useWagmi } from "../utils/wagmi/WagmiContext";
import { useWalletLogin, useWalletLogout, useActiveProfile } from "@lens-protocol/react-web";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { Magic } from "magic-sdk";
import { IPaymaster, BiconomyPaymaster } from "@biconomy/paymaster";
import { IBundler, Bundler } from "@biconomy/bundler";
import { BiconomySmartAccount, BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account";
import { ethers } from "ethers";
import { getFromLocalStorage, saveToLocalStorage } from "../utils";
import { useRouter } from "next/router";

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
  MAGIC = "magic",
  LENS = "lens",
}

export default function Home() {
  const {
    dispatch,
    state: { loggedInVia },
  } = useContext(GlobalContext);
  const [loader, setLoader] = useState(false);
  const [initLoader, setInitLoader] = useState(false);
  const { openConnectModal } = useConnectModal();

  const [openLogin, setSdk] = useState<any>("");
  const [safeLogin, setSafeLogin] = useState<any>("");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [step, setStep] = useState<number>(0);
  const [openBottomSheet, setOpenBottomSheet] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const { getAccount, disconnect } = useWagmi();
  const { address, isConnecting, isConnected } = useAccount();
  const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const { execute: login, error: loginError, isPending: isLoginPending } = useWalletLogin();

  const { execute: logout } = useWalletLogout();
  const { disconnectAsync } = useDisconnect();

  const router = useRouter();

  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });

  useEffect(() => {
    async function initLens() {
      if (loggedIn) {
        try {
            const activeProfile = useActiveProfile();
            const { data: profile } = activeProfile;
            if (profile == null) {
                await disconnect();
                toast.info("Your wallet doesn't have lens account");
            }
        } catch(e){
            await disconnect();
            toast.info("Your wallet doesn't have lens account");
        }
      }
    }
    initLens();
  }, [loggedIn]);

  const onLoginClick = async () => {
    try {
      if (isConnected) {
        await disconnectAsync();
      }

      const { connector } = await connectAsync();

      if (connector instanceof InjectedConnector) {
        const walletClient = await connector.getWalletClient();

        const resp = await login({
          address: walletClient.account.address,
        });
        const prov = await connector?.getProvider();
        saveToLocalStorage("lensProvider", prov);
        setLoggedIn(true);
        await connectWithBiconomy(prov, LOGGED_IN.LENS);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const handleDisconnect = async () => {
    if (isConnected) {
      await disconnectAsync();
    }
    // await logout();
    await disconnect();
    saveToLocalStorage("loginType", "");
    localStorage.removeItem("isGoogleLogin");
    localStorage.removeItem("isConnected");
    handleSteps(ESTEPS.ONE);
    setWalletAddress("");
    dispatch({
      type: ACTIONS.LOGOUT,
      payload: "",
    });
    dispatch({
      type: ACTIONS.LOGGED_IN_VIA,
      payload: "",
    });
    dispatch({
      type: ACTIONS.SET_ADDRESS,
      payload: "",
    });
  };

  useEffect(() => {
    const item = localStorage.getItem("isGoogleLogin");
    if (item) {
      handleSteps(ESTEPS.THREE);
    } else {
      handleSteps(ESTEPS.ONE);
    }
    async function initializeOpenLogin() {
      item && setLoader(true);
      setInitLoader(true);
      const chainConfig = {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: BaseGoerli.chainIdHex,
        rpcTarget: BaseGoerli.info.rpc,
        displayName: BaseGoerli.name,
        blockExplorer: BaseGoerli.explorer.url,
        ticker: BaseGoerli.symbol,
        tickerName: "Ethereum",
      };

      const web3auth = new Web3AuthNoModal({
        clientId: web3AuthClientId,
        web3AuthNetwork: "testnet",
        chainConfig: chainConfig,
      });

      const privateKeyProvider = new EthereumPrivateKeyProvider({
        config: { chainConfig },
      });

      const openloginAdapter = new OpenloginAdapter({
        adapterSettings: {
          uxMode: "popup",
          loginConfig: {
            google: {
              name: productName,
              verifier: web3AuthVerifier,
              typeOfLogin: web3AuthLoginType,
              clientId: oauthClientId,
            },
          },
        },
        loginSettings: {
          mfaLevel: "none",
        },
        privateKeyProvider,
      });

      web3auth.configureAdapter(openloginAdapter);
      setWeb3auth(web3auth);
      await web3auth.init();
      setProvider(web3auth.provider);
      setInitLoader(false);
    }

    initializeOpenLogin();
  }, []);

  useEffect(() => {
    if (web3auth && web3auth.connected) {
      setLoader(true);
      getAccounts()
        .then((res: any) => {
          setLoader(false);
          dispatch({
            type: ACTIONS.LOGGED_IN_VIA,
            payload: LOGGED_IN.GOOGLE,
          });
          dispatch({
            type: ACTIONS.SET_ADDRESS,
            payload: res,
          });
          setWalletAddress(res);
        })
        .catch((e) => {
          console.log(e, "error");
        });
    }
  }, [provider]);

  const signIn = async () => {
    setLoader(true);
    try {
      if (!web3auth) {
        return;
      }
      if (web3auth.connected) {
        return;
      }
      const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
        loginProvider: "google",
      });
      setProvider(web3authProvider);
      const acc = (await getAccounts()) as any;
      const email = await (await web3auth.getUserInfo()).email;
      localStorage.setItem("email", email ?? "");
      localStorage.setItem("isConnected", "true");
      localStorage.setItem("isGoogleLogin", "true");
      dispatch({
        type: ACTIONS.LOGGED_IN_VIA,
        payload: LOGGED_IN.GOOGLE,
      });
      dispatch({
        type: ACTIONS.SET_ADDRESS,
        payload: acc,
      });
      setWalletAddress(acc);
      setLoader(false);
      handleSteps(ESTEPS.THREE);
    } catch (e) {
      setLoader(false);
      console.log(e, "e");
    }
  };

  const getAccounts = async () => {
    if (!provider) {
      return;
    }
    try {
      const contractAddress = await deploySafeContract();
      return await contractAddress;
    } catch (error) {
      setLoader(false);
      return error;
    }
  };

  const deploySafeContract = async () => {
    const ethProvider = new ethers.providers.Web3Provider(provider!);
    const signer = await ethProvider.getSigner();
    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer || ethProvider,
    });
    const safeFactory = await SafeFactory.create({ ethAdapter: ethAdapter });
    const safeAccountConfig: SafeAccountConfig = {
      owners: [await signer.getAddress()],
      threshold: 1,
    };
    const safeSdkOwnerPredicted = await safeFactory.predictSafeAddress(safeAccountConfig);
    return safeSdkOwnerPredicted;
  };

  const signOut = async () => {
    await web3auth?.logout();
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

  const [account, setAccount] = useState<any>();
  const [idToken, setIdToken] = useState<any>();
  const [magic, setMagic] = useState<any>();
  const [showOtp, setShowOtp] = useState(false);
  const [signinLoading, setSigninLoading] = useState(false);
  const [showMsg, setShowMsg] = useState(false);

  useEffect(() => {
    async function initMagic() {
      const loggedInVia = getFromLocalStorage("loginType");
      const add = getFromLocalStorage("address");
      if (window !== undefined) {
        setLoader(true);
        const magicSdk = new Magic("pk_live_8A226AACC0D8D290");
        const prov = await magicSdk.wallet.getProvider();
        setProvider(prov);
        setMagic(magicSdk);
        const isLoggedIn = await magicSdk.user.isLoggedIn();
        if (router && router.query.magic_credential) {
          try {
            await magicSdk.auth.loginWithCredential();
            const userMetadata = await magicSdk.user.getMetadata();
            saveToLocalStorage("email", userMetadata.email);
            connectWithBiconomy(magicSdk.rpcProvider, LOGGED_IN.MAGIC);
          } catch (e) {
            console.error(e);
          }
        } else if (isLoggedIn) {
          const userMetadata = await magicSdk.user.getMetadata();
          saveToLocalStorage("email", userMetadata.email);
          connectWithBiconomy(magicSdk.rpcProvider, LOGGED_IN.MAGIC);
        } else if (loggedInVia && loggedInVia === LOGGED_IN.LENS && add) {
          const { connector } = await connectAsync();
          connectWithBiconomy(await connector?.getProvider(), LOGGED_IN.LENS);
        } else {
          setLoader(false);
        }
      }
    }
    initMagic();
  }, [router]);

  const signOutMagic = async () => {
    await magic.user.logout();
    localStorage.removeItem("isGoogleLogin");
    localStorage.removeItem("isConnected");
    setWalletAddress("");
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
  };

  const connectWithBiconomy = async (rpcProvider: any, logintype: LOGGED_IN) => {
    setLoader(true);
    try {
      const web3Provider = new ethers.providers.Web3Provider(rpcProvider, "any");

      const paymaster = new BiconomyPaymaster({
        paymasterUrl: "https://paymaster.biconomy.io/api/v1/84531/76v47JPQ6.7a881a9f-4cec-45e0-95e9-c39c71ca54f4",
      });

      const bundler: IBundler = new Bundler({
        bundlerUrl: "https://bundler.biconomy.io/api/v2/84531/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
        chainId: 84531,
        entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
      });
      let wallet = new BiconomySmartAccount({
        signer: web3Provider.getSigner(),
        chainId: 84531,
        bundler: bundler,
        paymaster: paymaster,
      });
      wallet = await wallet.init({
        accountIndex: 0,
      });
      const scw = await wallet.getSmartAccountAddress();
      dispatch({
        type: ACTIONS.LOGGED_IN_VIA,
        payload: logintype,
      });
      dispatch({
        type: ACTIONS.SET_ADDRESS,
        payload: scw,
      });
      dispatch({
        type: ACTIONS.SET_SMART_ACCOUNT,
        payload: wallet,
      });
      setWalletAddress(scw ?? "");
      setLoader(false);
      saveToLocalStorage("address", scw);
      saveToLocalStorage("loginType", logintype);
      handleSteps(ESTEPS.THREE);
    } catch (error) {
      setLoader(false);
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  const connectMagicWallet = async (val: string) => {
    setSigninLoading(true);
    const redirectURI = `${window.location.origin}`;
    const loginWithLink = magic.auth.loginWithMagicLink({
      email: val,
      showUI: false,
      redirectURI: redirectURI,
    });
    loginWithLink
      .on("email-sent", (result: any) => {
        setSigninLoading(false);
        setShowMsg(true);
        toast.success("Magic link has been sent!. Check your mail");
      })
      .on("done", (result: any) => {
        toast.success("Login sussessful through magic link");
      })
      .on("error", (reason: any) => {
        setSigninLoading(false);
        toast.error("Something went wrong!");
        console.error(reason, "errorqw");
      })
      .on("settled", () => {
        // is called when the Promise either resolves or rejects
      });
  };

  const getUIComponent = (step: number) => {
    switch (step) {
      case ESTEPS.ONE:
        return <HomePage handleSetupChest={handleSetupChest} loader={loader} />;
      case ESTEPS.TWO:
        return <ConnectWallet signIn={connectMagicWallet} handleSteps={handleSteps} loader={loader} handleLensLogin={onLoginClick} showOtp={showOtp} loading={signinLoading} showMsg={showMsg} />;
      case ESTEPS.THREE:
        return <LoadChestComponent provider={provider} loader={loader} />;
      default:
        return <></>;
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
      setConnecting(false);
      toast.error(err.message);
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
      <Header walletAddress={walletAddress} signIn={onLoginClick} step={step} handleSteps={handleSteps} onHamburgerClick={onHamburgerClick} signOut={signOutMagic} setWalletAddress={setWalletAddress} loader={loader} initLoader={initLoader} handleDisconnect={handleDisconnect} />
      <div className="p-4 relative">
        <ToastContainer toastStyle={{ backgroundColor: "#282B30" }} className={`w-50`} style={{ width: "600px" }} position="bottom-center" autoClose={6000} hideProgressBar={true} newestOnTop={false} closeOnClick rtl={false} theme="dark" />
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
        {/* <Footer /> */}
      </div>
    </>
  );
}
