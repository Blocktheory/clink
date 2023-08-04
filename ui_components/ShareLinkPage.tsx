import "react-toastify/dist/ReactToastify.css";
import { serializeError } from "eth-rpc-errors";
import * as React from "react";
import { FC, useContext, useEffect, useMemo, useState } from "react";
import PrimaryBtn from "./PrimaryBtn";
import SecondaryBtn from "./SecondaryBtn";
import { icons } from "../utils/images";
import { Address } from "wagmi";
import { initWasm } from "@trustwallet/wallet-core";
import { Wallet } from "../utils/wallet";
import Image from "next/image";
import { toast } from "react-toastify";
import {
    getBalance,
    getEstimatedGas,
    getNonce,
    getSendRawTransaction,
    getUsdPrice,
} from "../apiServices";
import {
    getCurrencyFormattedNumber,
    getTokenFormattedNumber,
    hexToNumber,
    numHex,
} from "../utils";
import { Base } from "../utils/chain/base";
import { TTranx, TRANSACTION_TYPE } from "../utils/wallet/types";
import { useWagmi } from "../utils/wagmi/WagmiContext";
import { GlobalContext } from "../context/GlobalContext";
import { ToastContainer } from "react-toastify";

export interface IShareLink {
    uuid: string;
}

const ShareLink: FC<IShareLink> = (props) => {
    const { connect, fetchBalance, baseGoerli, injectConnector, getAccount } = useWagmi();
    const {
        state: { googleUserInfo, isConnected },
    } = useContext(GlobalContext);
    const { uuid } = props;
    const [amount, setAmount] = useState({
        eth: "0.1",
        dollars: "1",
    });
    const [toAddress, setToAddress] = useState("");
    const [walletBalance, setWalletBalance] = useState(0);
    const [fromAddress, setFromAddress] = useState("");
    const [wallet, setWallet] = useState("" as unknown as Wallet);
    const [shareText, setShareText] = useState("Share");
    const [showShareIcon, setShowShareIcon] = useState(true);
    const [tokenValue, setTokenValue] = useState(0);
    const [headingText, setHeadingText] = useState("Your chest is ready");
    const [linkValueUsd, setLinkValueUsd] = useState("");
    const [isRedirected, setIsRedirected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [processing, setProcessing] = useState(false);
    const shareData = {
        text: "Here is you Gift card",
        url: typeof window !== "undefined" ? window.location.href : "",
    };

    const handleShareURL = () => {
        if (navigator?.share) {
            navigator
                .share(shareData)
                .then(() => console.log("Successfully shared"))
                .catch((error) => console.log("Error sharing", error));
        }
    };
    useMemo(async () => {
        if (!isConnected) {
            setHeadingText("Claim your Chest");
        }
    }, [isConnected]);

    const copyToClipBoard = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(window.location.href);
        setShareText("Link Copied!");
        setShowShareIcon(false);
        setTimeout(() => {
            setShareText("Share");
            setShowShareIcon(true);
        }, 4000);
    };

    useMemo(async () => {
        if (uuid) {
            const walletCore = await initWasm();
            const wallet = new Wallet(walletCore);
            setWallet(wallet);
            const account = wallet.getAccountFromPayLink(uuid);
            if (account) {
                setFromAddress(account);
            } else {
                console.log("error", "invalid identifier");
            }
            getUsdPrice().then(async (res: any) => {
                const balance = (await getBalance(account)) as any;
                setTokenValue(
                    getTokenFormattedNumber(
                        hexToNumber(balance.result) as unknown as string,
                        18,
                    ),
                );
                setIsLoading(false);
                const formatBal = (
                    (hexToNumber(balance.result) / Math.pow(10, 18)) *
                    res.data.ethereum.usd
                ).toFixed(3);
                setLinkValueUsd(getCurrencyFormattedNumber(formatBal));
            });
        }
    }, [uuid]);

    useMemo(async () => {
        if (toAddress && fromAddress) {
            const balance = await fetchBalance({
                address: fromAddress as Address,
            });
            // sendToken(toAddress);
        }
    }, [toAddress]);

    const handleConnect = async () => {
        setProcessing(true);
        const account = await getAccount();
        if (account.isConnected) {
            setToAddress(account.address);
            sendToken(account.address);
        } else {
            try {
                const result = await connect({
                    chainId: baseGoerli.id,
                    connector: injectConnector,
                });
                setToAddress(result.account);
                toast.success(`Wallet Connected`);
                sendToken(result.account);
            } catch (e: any) {
                const err = serializeError(e);
                console.log(err, "err");
                setProcessing(false);
                toast.error(e.message);
            }
        }
    };

    const sendToken = async (toAdd: string) => {
        setProcessing(true);
        try {
            const walletCore = await initWasm();
            const wallet = new Wallet(walletCore);
            const balance = (await getBalance(fromAddress)) as any;
            let tokenAmount = String(numHex(Number(balance.result)));
            if (!tokenAmount.startsWith("0x")) {
                tokenAmount = "0x" + tokenAmount;
            }
            const gasLimitData = (await getEstimatedGas({
                from: fromAddress,
                to: toAdd,
                value: balance.result,
            })) as any;
            const nonce = (await getNonce(fromAddress)) as any;
            const tx: TTranx = {
                toAddress: toAdd,
                nonceHex: nonce.result,
                chainIdHex: numHex(Number(Base.chainId)),
                // gas price is hardcoded to pass 1 by default as of now
                gasPriceHex: "3B9ACA00" ?? "0x1",
                gasLimitHex: gasLimitData.result,
                amountHex: balance.result,
                amount: Number(tokenAmount),
                contractDecimals: 18,
                fromAddress: fromAddress,
                transactionType: TRANSACTION_TYPE.SEND,
                isNative: true,
            };
            const privKey = await wallet.getPrivKeyFromPayLink(uuid);
            const txData = await wallet.signEthTx(tx, privKey);
            const rawTx = (await getSendRawTransaction(txData)) as any;
            if (rawTx.error) {
                setProcessing(false);
                const err = serializeError(rawTx.error.message);
                toast.error(err.message);
            } else {
                setProcessing(false);
                toast.error("Claimed Successfully");
            }
            setProcessing(false);
        } catch (e: any) {
            setProcessing(false);
            toast.error(e.message);
            console.log(e, "e");
        }
    };

    useEffect(() => {
        const redirected = localStorage.getItem("chestRedirect") ? true : false;
        setIsRedirected(redirected);
        return () => {
            localStorage.removeItem("chestRedirect");
        };
    }, []);

    return (
        <div className="w-full h-screen relative flex items-center">
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
            <div className="w-full h-[70%] text-center p-4  flex flex-col gap-5 items-center">
                <p className="text-white text-[20px] font-bold">{headingText}</p>
                <div className="w-full md:w-[60%] max-w-[450px] h-[300px] rounded-lg shareLinkBg flex flex-col justify-between mb-16">
                    {isLoading ? (
                        <div className="w-full h-full mt-5 ml-5">
                            <div className="w-[15%] h-[20%] bg-white/10 animate-pulse rounded-lg mb-2"></div>
                            <div className="w-[10%] h-[12%] bg-white/10 animate-pulse rounded-lg "></div>
                        </div>
                    ) : (
                        <div className="flex gap-1 flex-col text-start ml-3">
                            <p className="text-[40px] text-[#F4EC97] font bold">{`$ ${amount.dollars}`}</p>
                            <p className="text-sm text-white/50">{`~ ${amount.eth} ETH`}</p>
                        </div>
                    )}
                    <div className="self-end">
                        <Image className="" src={icons.tchest} alt="Chest" />
                    </div>
                </div>
                {isRedirected ? (
                    <>
                        <div className="lg:hidden block w-full">
                            <PrimaryBtn
                                title="Share"
                                onClick={() => {
                                    handleShareURL();
                                }}
                                rightImage={showShareIcon ? icons.shareBtnIcon : ""}
                                showShareIcon={showShareIcon}
                            />
                        </div>
                        <div className="hidden lg:block w-full max-w-[320px]">
                            <PrimaryBtn
                                title={shareText}
                                onClick={copyToClipBoard}
                                rightImage={showShareIcon ? icons.shareBtnIcon : ""}
                            />
                        </div>
                        <SecondaryBtn
                            title={processing ? "Processing..." : "Claim"}
                            onClick={() => handleConnect()}
                            rightImage={processing ? undefined : icons.downloadBtnIcon}
                        />
                    </>
                ) : (
                    <>
                        <SecondaryBtn
                            title={processing ? "Processing..." : "Claim"}
                            onClick={() => handleConnect()}
                            rightImage={processing ? undefined : icons.downloadBtnIcon}
                        />
                        <div className="lg:hidden block w-full">
                            <PrimaryBtn
                                title="Share"
                                onClick={() => {
                                    handleShareURL();
                                }}
                                rightImage={showShareIcon ? icons.shareBtnIcon : ""}
                                showShareIcon={showShareIcon}
                            />
                        </div>
                        <div className="hidden lg:block w-full max-w-[320px]">
                            <PrimaryBtn
                                title={shareText}
                                onClick={copyToClipBoard}
                                rightImage={showShareIcon ? icons.shareBtnIcon : ""}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
export default ShareLink;
