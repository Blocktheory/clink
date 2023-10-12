import "react-toastify/dist/ReactToastify.css";

import AccountAbstraction from "@safe-global/account-abstraction-kit-poc";
import { EthersAdapter } from "@safe-global/protocol-kit";
import { SafeAccountConfig, SafeFactory } from "@safe-global/protocol-kit";
import { GelatoRelayPack } from "@safe-global/relay-kit";
import { MetaTransactionData, MetaTransactionOptions, OperationType } from "@safe-global/safe-core-sdk-types";
import { initWasm } from "@trustwallet/wallet-core";
import { serializeError } from "eth-rpc-errors";
import { ethers } from "ethers";
import Lottie from "lottie-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { FC, useContext, useEffect, useRef, useState } from "react";
import React from "react";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import ReactTyped from "react-typed";
import { parseEther } from "viem";

import { getBalance, getRelayTransactionStatus, getSendTransactionStatus, getUnlimitBuy, getUnlimitConfiguration, getUnlimitQuotes, getUsdPrice } from "../../apiServices";
import { GlobalContext } from "../../context/GlobalContext";
import { LOGGED_IN, THandleStep } from "../../pages";
import * as loaderAnimation from "../../public/lottie/loader.json";
import { encodeAddress, getCurrencyFormattedNumber, getTokenFormattedNumber, getTokenValueFormatted, hexToNumber } from "../../utils";
import { BaseGoerli } from "../../utils/chain/baseGoerli";
import { icons } from "../../utils/images";
import { useWagmi } from "../../utils/wagmi/WagmiContext";
import { Wallet } from "../../utils/wallet";
import PrimaryBtn from "../PrimaryBtn";
import SecondaryBtn from "../SecondaryBtn";
import DepositAmountModal from "./DepositAmountModal";
import { ProfileCard } from "./ProfileCard";
import { GateFiEventTypes, GateFiDisplayModeEnum, GateFiSDK } from "@gatefi/js-sdk";
import { IPaymaster, BiconomyPaymaster } from "@biconomy/paymaster";
import { IBundler, Bundler } from "@biconomy/bundler";
import { BiconomySmartAccount, BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account";
import { IHybridPaymaster, PaymasterMode, SponsorUserOperationDto } from "@biconomy/paymaster";
import * as CryptoJS from "crypto-js";
import { nanoid } from "nanoid/non-secure";

export interface ILoadChestComponent {
  provider?: any;
  loader: boolean;
}
export const LoadChestComponent: FC<ILoadChestComponent> = (props) => {
  const { provider, loader } = props;

  const {
    state: { loggedInVia, address, smartAccount: biconomyWallet },
  } = useContext(GlobalContext);

  const router = useRouter();

  const [value, setValue] = useState("");
  const [price, setPrice] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [tokenPrice, setTokenPrice] = useState("");
  const [tokenValue, setTokenValue] = useState(0);
  const [fromAddress, setFromAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [toggle, setToggle] = useState(true);
  const [btnDisable, setBtnDisable] = useState(true);
  const [balanceInUsd, setBalanceInUsd] = useState("");
  const [showActivity, setShowActivity] = useState(false);
  const [chestLoadingText, setChestLoadingText] = useState("");
  const ethersProvider = new ethers.providers.JsonRpcProvider(BaseGoerli.info.rpc);
  const relayPack = new GelatoRelayPack(process.env.NEXT_PUBLIC_GELATO_RELAY_API_KEY);
  const isRelayInitiated = useRef(false);
  const handleToggle = () => {
    setToggle(!toggle);
  };

  const { sendTransaction } = useWagmi();

  const overlayInstanceSDK = useRef<GateFiSDK | null>(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  useEffect(() => {
    return () => {
      overlayInstanceSDK.current?.destroy();
      overlayInstanceSDK.current = null;
    };
  }, []);

  useEffect(() => {
    const secretKey: string = "LsdDnGNJCpbVfVOEvpZdLDNpyMhECvrQ";

    // String will be method + api path
    const dataVerify: string = "GET" + "/onramp/v1/configuration";

    const hash: CryptoJS.lib.WordArray = CryptoJS.HmacSHA256(dataVerify, secretKey);
    const sig = CryptoJS.enc.Hex.stringify(hash);

    getUnlimitConfiguration(sig).then((res: any) => {
      console.log(res, "result");
    });
  }, []);

  useEffect(() => {
    if (address) {
      fetchBalance();
      handleInitWallet();
      const secretKey: string = "LsdDnGNJCpbVfVOEvpZdLDNpyMhECvrQ";

      // String will be method + api path
      const dataVerify: string = "GET" + "/onramp/v1/quotes";

      const hash: CryptoJS.lib.WordArray = CryptoJS.HmacSHA256(dataVerify, secretKey);
      const sig = CryptoJS.enc.Hex.stringify(hash);
      getUnlimitQuotes(sig);
    }
  }, [address]);

  const handleBuy = () => {
    const secretKey: string = "LsdDnGNJCpbVfVOEvpZdLDNpyMhECvrQ";

    // String will be method + api path
    const dataVerify: string = "GET" + "/onramp/v1/buy";

    const hash: CryptoJS.lib.WordArray = CryptoJS.HmacSHA256(dataVerify, secretKey);
    const sig = CryptoJS.enc.Hex.stringify(hash);
    const valueWithoutDollarSign = value.replace(/[^\d.]/g, "");
    getUnlimitBuy(sig, {
      orderCustomId: nanoid(10),
      amount: valueWithoutDollarSign,
      walletAddress: address,
    }).then(async (res: any) => {
      console.log(res["headers"]["x-final-url"], "buy res");
      if (res["headers"]["x-final-url"]) {
        window.open(res["headers"]["x-final-url"], "_blank");
      }
      // await axios.get(res.headers.x-final-url as unknown as string);
    });
  };

  const fetchBalance = async () => {
    setLoading(true);
    getUsdPrice()
      .then(async (res: any) => {
        setTokenPrice(res.data.neo.usd);
        setFromAddress(address);
        const balance = (await getBalance(address)) as any;
        setTokenValue(getTokenFormattedNumber(hexToNumber(balance.result) as unknown as string, 18));
        const formatBal = ((hexToNumber(balance.result) / Math.pow(10, 18)) * res.data.neo.usd).toFixed(3);
        setPrice(getCurrencyFormattedNumber(formatBal));
        setBalanceInUsd(formatBal);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleValueClick = (val: string) => {
    setValue(`$${val}`);
    const valueWithoutDollarSign = val.replace(/[^\d.]/g, "");
    const tokenIputValue = Number(valueWithoutDollarSign) / Number(tokenPrice);
    setInputValue(getTokenValueFormatted(Number(tokenIputValue)));
    setBtnDisable(false);
  };

  const handleInputChange = (val: string) => {
    const valueWithoutDollarSign = val.replace(/[^\d.]/g, "");
    let appendDollar = "";
    if (Number(valueWithoutDollarSign) > 0) {
      appendDollar = "$";
    }
    setValue(`${appendDollar}${valueWithoutDollarSign}`);
    const tokenIputValue = Number(valueWithoutDollarSign) / Number(tokenPrice);
    setInputValue(getTokenValueFormatted(Number(tokenIputValue)));
    if (Number(valueWithoutDollarSign) < Number(balanceInUsd)) {
      setBtnDisable(false);
    } else {
      setBtnDisable(true);
    }
  };

  const [destinationAddress, setDestinationAddress] = useState("");
  const [linkHash, setLinkHash] = useState("");
  const [isSucceed, setIsSucceed] = useState(false);
  const [explorerUrl, setExplorerUrl] = useState("");

  const safeAccountAbstraction = useRef<AccountAbstraction>();

  const handleInitWallet = async () => {
    const walletCore = await initWasm();
    const wallet = new Wallet(walletCore);
    const payData = await wallet.createPayLink();
    const web3Provider = new ethers.Wallet(payData.key, ethersProvider);

    setChestLoadingText("Setting up destination signer and address");

    const paymaster = new BiconomyPaymaster({
      paymasterUrl: "https://paymaster.biconomy.io/api/v1/84531/76v47JPQ6.7a881a9f-4cec-45e0-95e9-c39c71ca54f4",
    });

    const bundler: IBundler = new Bundler({
      bundlerUrl: "https://bundler.biconomy.io/api/v2/84531/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
      chainId: 84531,
      entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    });
    let biWallet = new BiconomySmartAccount({
      signer: web3Provider,
      chainId: 84531,
      bundler: bundler,
      paymaster: paymaster,
    });
    biWallet = await biWallet.init({
      accountIndex: 0,
    });
    const scw = await biWallet.getSmartAccountAddress();
    const destinatinoHash = encodeAddress(scw);
    const fullHash = payData.link + "~" + destinatinoHash;
    setLinkHash(fullHash);
    setDestinationAddress(scw);
  };

  const createWallet = async () => {
    const _inputValue = inputValue.replace(/[^\d.]/g, "");
    if (_inputValue) {
      setTransactionLoading(true);
      setChestLoadingText("Initializing wallet and creating link...");
      const amount = ethers.utils.parseEther(_inputValue);
      const data = "0x";
      const tx = {
        to: destinationAddress,
        value: amount,
        data,
      };
      const smartAccount = biconomyWallet;
      let partialUserOp = await smartAccount.buildUserOp([tx]);
      setChestLoadingText("Setting up smart account...");
      const biconomyPaymaster = smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;
      let paymasterServiceData: SponsorUserOperationDto = {
        mode: PaymasterMode.SPONSORED,
        // optional params...
      };

      try {
        setChestLoadingText("Setting up paymaster...");
        const paymasterAndDataResponse = await biconomyPaymaster.getPaymasterAndData(partialUserOp, paymasterServiceData);
        partialUserOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;

        const userOpResponse = await smartAccount.sendUserOp(partialUserOp);
        const transactionDetails = await userOpResponse.wait();
        setExplorerUrl(`https://goerli.basescan.org/tx/${transactionDetails.receipt.transactionHash}`);
        setChestLoadingText("Success! Transaction Processed");
        setIsSucceed(true);
        handleTransactionStatus(transactionDetails.receipt.transactionHash, linkHash);
        setChestLoadingText("Transaction Submitted!");

        // router.push(linkHash);
      } catch (error) {
        console.error("Error executing transaction:", error);
      }
    }
  };

  const handleBuyCrypto = () => {
    if (overlayInstanceSDK.current) {
      if (isOverlayVisible) {
        overlayInstanceSDK.current.hide();
        setIsOverlayVisible(false);
      } else {
        overlayInstanceSDK.current.show();
        setIsOverlayVisible(true);
      }
    } else {
      const email = localStorage.getItem("email");
      const randomString = require("crypto").randomBytes(32).toString("hex");
      overlayInstanceSDK.current = new GateFiSDK({
        merchantId: process.env.NEXT_PUBLIC_MERCHANT_ID ?? "",
        displayMode: GateFiDisplayModeEnum.Overlay,
        nodeSelector: "#overlay-button",
        isSandbox: true,
        walletAddress: address ?? "",
        email: email ?? "",
        externalId: randomString,
        defaultFiat: {
          currency: "USD",
          amount: "100",
        },
        defaultCrypto: {
          currency: "ETH",
        },
      });
    }

    overlayInstanceSDK.current?.show();
    setIsOverlayVisible(true);
  };

  const handleTransactionStatus = (hash: string, link: string) => {
    setChestLoadingText("Verifying Transaction status");
    const intervalInMilliseconds = 2000;
    const interval = setInterval(() => {
      getSendTransactionStatus(hash)
        .then((res: any) => {
          if (res.result) {
            const status = Number(res.result.status);
            if (status === 1) {
              setChestLoadingText("Transaction Executed Successfully");
              toast.success("Transaction Executed Successfully");
              router.push(linkHash);
              setTransactionLoading(false);
              fetchBalance();
              // handleClose();
            } else {
              setTransactionLoading(false);
              toast.error("Failed to Deposit Amount. Try Again");
            }
            if (interval !== null) {
              clearInterval(interval);
            }
          }
        })
        .catch((e) => {
          setTransactionLoading(false);
          const err = serializeError(e);
          toast.error(err.message);
          console.log(e, "error");
        });
    }, intervalInMilliseconds);
  };

  const handleShowActivity = () => {
    setShowActivity(!showActivity);
  };

  return (
    <div className="mx-auto relative max-w-[400px]">
      {!transactionLoading ? (
        <div>
          <ProfileCard balance={price} showActivity={false} transactionLoading={loader}></ProfileCard>

          {!showActivity ? (
            <>
              <div className="rounded-lg border border-[#010101] bg-white/5 ">
                <div className="flex items-center justify-between py-2 px-4">
                  <div>
                    <p className="text-[#010101] paragraph">YOUR BALANCE</p>
                    <div className="flex items-start gap-3 my-2">
                      <Image src={icons.transferIcon} alt="transferIcon" onClick={handleToggle} className="cursor-pointer" />
                      {toggle ? (
                        loading || loader ? (
                          <div className="w-full h-full">
                            <div className="w-[40px] h-[10px] bg-white/10 animate-pulse rounded-lg mb-2"></div>
                            <div className="w[40px] h-[10px] bg-white/10 animate-pulse rounded-lg "></div>
                          </div>
                        ) : (
                          <div>
                            <p className="text-[#010101] text-2xl font-semibold leading-10 mb-2">{price}</p>
                            <p className="text-[#010101] text-xs leading-[14px]">{tokenValue} ETH</p>
                          </div>
                        )
                      ) : loading ? (
                        <div className="w-full h-full">
                          <div className="w-[40px] h-[10px] bg-white/10 animate-pulse rounded-lg mb-2"></div>
                          <div className="w[40px] h-[10px] bg-white/10 animate-pulse rounded-lg "></div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-[#010101] text-2xl font-semibold leading-10 mb-2">~ {tokenValue} ETH</p>
                          <p className="text-[#010101] text-xs leading-[14px]">{price}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Image src={!loading && !loader ? icons.ethLogo : icons.loadAvatar} className="w-8 h-8" alt="transferIcon" />
                    {!loading && !loader ? <p className="text-[#010101] text-2xl font-normal leading-9">ETH</p> : <div className="w-10 h-3 my-2 animate-pulse bg-white/10 rounded-lg mx-auto"></div>}
                  </div>
                </div>
                <div
                  className="bg-[#010101]/20 py-2 rounded-b-lg cursor-pointer"
                  role="presentation"
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  <p className="text-[#010101] text-sm leading-[18px] font-medium text-center">+ Add funds to your account</p>
                </div>
              </div>
              <div className="w-full mt-5 ">
                <div className="relative rounded-lg border border-[#010101] h-auto p-4">
                  <div className="flex items-center justify-center">
                    <div>
                      <div className="flex items-center justify-center">
                        {/* <p className="text-[32px] text-white">$</p> */}
                        <input
                          name="usdValue"
                          style={{ caretColor: "#010101/20" }}
                          inputMode="decimal"
                          type="text"
                          className={`dollorInput pl-0 pt-2 pb-1 backdrop-blur-xl text-[32px] border-none text-center bg-transparent text-black dark:text-textDark-900 placeholder-black/30 rounded-lg block w-full focus:outline-none focus:ring-transparent`}
                          placeholder="$0"
                          value={value}
                          onChange={(e) => {
                            handleInputChange(e.target.value);
                          }}
                          disabled={loading}
                          onWheel={() => (document.activeElement as HTMLElement).blur()}
                        />
                      </div>
                      {Number(inputValue) > 0 && <p className="text-[#010101] text-sm leading-[14px] text-center">~ {inputValue} ETH</p>}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-5">
                <div
                  className="rounded-lg border border-[#010101] p-2 cursor-pointer custom-shadow-sm"
                  role="presentation"
                  onClick={() => {
                    handleValueClick("1");
                  }}
                >
                  <p className="text-center text-black">$1</p>
                </div>
                <div
                  className="rounded-lg border border-[#010101] p-2 cursor-pointer custom-shadow-sm"
                  role="presentation"
                  onClick={() => {
                    handleValueClick("2");
                  }}
                >
                  <p className="text-center text-black">$2</p>
                </div>
                <div
                  className="rounded-lg border border-[#010101] p-2 cursor-pointer custom-shadow-sm"
                  role="presentation"
                  onClick={() => {
                    handleValueClick("5");
                  }}
                >
                  <p className="text-center text-black">$5</p>
                </div>
              </div>
              <div className="relative mt-10">
                <div className={`flex gap-2 justify-between`}>
                  <PrimaryBtn className={`${!btnDisable && value ? "opacity-100" : "opacity-50"} !w-[45%] lg:w-[185px] max-w-[185px] !mx-0 ${btnDisable || !value ? "cursor-not-allowed" : ""}`} title={"Create Link"} onClick={createWallet} btnDisable={btnDisable || !value} />
                  <div
                    // id="overlay-button"
                    className="w-full lg:w-[185px] max-w-[185px]"
                  >
                    <SecondaryBtn className={`w-full text-[#010101] max-w-[185px] mx-0`} title={"Buy"} onClick={handleBuy} />
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      ) : (
        <div className="w-[full] max-w-[600px] h-full relative flex flex-col text-center items-center gap-5 mx-auto mt-20">
          <ReactTyped className="text-black text-[24px]" strings={[chestLoadingText]} typeSpeed={40} loop={true} />
          <Lottie animationData={loaderAnimation} />
        </div>
      )}
      <DepositAmountModal open={open} setOpen={setOpen} walletAddress={fromAddress} tokenPrice={tokenPrice} fetchBalance={fetchBalance} />
      {/* <div className="w-[400px] h-[400px] absolute -top-[200px] -right-[200px] -z-[10] bg-[#28D799] opacity-20 blur-[62px] rounded-full"></div> */}
    </div>
  );
};
