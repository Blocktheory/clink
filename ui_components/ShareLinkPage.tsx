import * as React from "react";
import { FC, useContext, useEffect, useMemo, useState } from "react";
import PrimaryBtn from "./PrimaryBtn";
import SecondaryBtn from "./SecondaryBtn";
import { icons } from "../utils/images";
import { Address } from "wagmi";
import { initWasm } from "@trustwallet/wallet-core";
import { Wallet } from "../utils/wallet";
import Image from "next/image";
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
            console.log(uuid, "uuid");
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
                const formatBal = (
                    (hexToNumber(balance.result) / Math.pow(10, 18)) *
                    res.data.ethereum.usd
                ).toFixed(3);
                setLinkValueUsd(getCurrencyFormattedNumber(formatBal));
                console.log(balance, "balance");
                console.log(tokenValue, "token value");
            });
        }
    }, [uuid]);

    useMemo(async () => {
        console.log("cam to memo");
        if (toAddress && fromAddress) {
            const balance = await fetchBalance({
                address: fromAddress as Address,
            });
            sendToken(toAddress);
        }
    }, [toAddress]);

    const handleConnect = async () => {
        const account = await getAccount();
        console.log(account, "account");
        if (account.isConnected) {
            setToAddress(account.address);
        } else {
            const result = await connect({
                chainId: baseGoerli.id,
                connector: injectConnector,
            });
            setToAddress(result.account);
        }
    };

    const sendToken = async (toAdd: string) => {
        try {
            const walletCore = await initWasm();
            const wallet = new Wallet(walletCore);
            const balance = (await getBalance(fromAddress)) as any;
            let tokenAmount = String(numHex(Number(balance.result)));
            console.log(tokenAmount, "token amount");
            if (!tokenAmount.startsWith("0x")) {
                tokenAmount = "0x" + tokenAmount;
            }
            const gasLimitData = (await getEstimatedGas({
                from: fromAddress,
                to: toAdd,
                value: tokenAmount,
            })) as any;
            const nonce = (await getNonce(fromAddress)) as any;
            const tx: TTranx = {
                toAddress: toAdd,
                nonceHex: nonce.result,
                chainIdHex: numHex(Number(Base.chainId)),
                // gas price is hardcoded to pass 1 by default as of now
                gasPriceHex: "3B9ACA00" ?? "0x1",
                gasLimitHex: gasLimitData.result,
                amountHex: numHex(balance.result),
                amount: Number(tokenAmount),
                contractDecimals: 18,
                fromAddress: fromAddress,
                transactionType: TRANSACTION_TYPE.SEND,
                isNative: true,
            };
            const privKey = await wallet.getPrivKeyFromPayLink(uuid);
            const txData = await wallet.signEthTx(tx, privKey);
            console.log(txData, "tx data");
            const rawTx = await getSendRawTransaction(txData);
            console.log(rawTx, "raw tx");
        } catch (e: any) {
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
            <div className="w-full h-[70%] text-center p-4  flex flex-col gap-5 items-center">
                <p className="text-white text-[20px] font-bold">{headingText}</p>
                <div className="w-full md:w-[60%] max-w-[450px] h-[300px] rounded-lg shareLinkBg flex flex-col justify-between mb-16">
                    <div className="flex gap-1 flex-col text-start ml-3">
                        <p className="text-[40px] text-[#F4EC97] font bold">{`${linkValueUsd}`}</p>
                        <p className="text-sm text-white/50">{`~ ${tokenValue} ETH`}</p>
                    </div>
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
                            title="Claim"
                            onClick={() => handleConnect()}
                            rightImage={icons.downloadBtnIcon}
                        />
                    </>
                ) : (
                    <>
                        <SecondaryBtn
                            title="Claim"
                            onClick={() => handleConnect()}
                            rightImage={icons.downloadBtnIcon}
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
