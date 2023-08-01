import * as React from "react";
import { FC, useMemo, useState } from "react";
import PrimaryBtn from "./PrimaryBtn";
import SecondaryBtn from "./SecondaryBtn";
import { icons } from "../utils/images";
import { Address } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { initWasm } from "@trustwallet/wallet-core";
import { Wallet } from "../utils/wallet";
import Image from "next/image";
import { fetchBalance, connect } from "@wagmi/core";
import { baseGoerli } from "wagmi/chains";

export interface IShareLink {
    uuid: string;
}

const ShareLink: FC<IShareLink> = (props) => {
    const { uuid } = props;
    const [amount, setAmount] = useState({
        eth: "0.1",
        dollars: "1",
    });
    const [toAddress, setToAddress] = useState("");
    const [fromAddress, setFromAddress] = useState("");
    const [wallet, setWallet] = useState("" as unknown as Wallet);
    const [shareText, setShareText] = React.useState("Share");
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

    const copyToClipBoard = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(`test URL`);
        setShareText("Link Copied!");
        setTimeout(() => {
            setShareText("Share");
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
        }
    }, [uuid]);

    useMemo(async () => {
        if (toAddress && fromAddress) {
            const balance = await fetchBalance({
                address: fromAddress as Address,
            });
            //handleSendHere
        }
    }, [toAddress]);

    const handleConnect = async () => {
        const result = await connect({
            chainId: 84531,
            connector: new InjectedConnector({ chains: [baseGoerli] }),
        });
        setToAddress(result.account);
    };

    return (
        <div className="w-full h-full relative">
            <div className="w-full h-[70%] text-center p-4  flex flex-col gap-5 relative top-[25%] items-center">
                <p className="text-white text-[20px] font-bold">Your chest is ready</p>
                <div className="w-full md:w-[60%] max-w-[450px] h-[300px] rounded-lg shareLinkBg flex flex-col justify-between mb-16">
                    <div className="flex gap-1 flex-col text-start ml-3">
                        <p className="text-[40px] text-[#F4EC97] font bold">{`$ ${amount.dollars}`}</p>
                        <p className="text-sm text-white/50">{`~ ${amount.eth} ETH`}</p>
                    </div>
                    <div className="self-end">
                        <Image className="" src={icons.tchest} alt="Chest" />
                    </div>
                </div>
                <div className="lg:hidden block w-full">
                    <PrimaryBtn
                        title="Share"
                        onClick={() => {
                            handleShareURL();
                        }}
                        rightImage={icons.shareBtnIcon}
                    />
                </div>
                <div className="hidden lg:block w-full max-w-[320px]">
                    <PrimaryBtn
                        title={shareText}
                        onClick={copyToClipBoard}
                        rightImage={icons.shareBtnIcon}
                    />
                </div>
                <SecondaryBtn
                    title="Claim"
                    onClick={() => handleConnect()}
                    rightImage={icons.downloadBtnIcon}
                />
            </div>
        </div>
    );
};
export default ShareLink;
