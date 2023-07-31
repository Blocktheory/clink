import * as React from "react";
import { FC, useEffect, useMemo, useState } from "react";
import PrimaryBtn from "./PrimaryBtn";
import SecondaryBtn from "./SecondaryBtn";
import { icons } from "../utils/images";
import { useAccount, useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { initWasm } from "@trustwallet/wallet-core";
import { Wallet } from "../utils/wallet";

export interface IShareLink {
    uuid: string;
}

const ShareLink: FC<IShareLink> = (props) => {
    const { uuid } = props;
    const { address } = useAccount();
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    });

    const [fromAddress, setFromAddress] = useState("");
    const [wallet, setWallet] = useState("" as unknown as Wallet);

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

    useMemo(() => {
        if (address && fromAddress) {
            //handleSendHere
        }
    }, [address]);

    return (
        <div className="w-full h-full relative">
            <div className="w-full h-[70%] text-center p-4  flex flex-col gap-5 relative top-[25%] items-center">
                <p className="text-white text-[16px]">Your chest is ready</p>
                <div className="w-full h-[300px] rounded-lg shareLinkBg flex flex-col justify-between mb-16">
                    <div className="flex gap-1 flex-col text-start ml-3">
                        <p className="text-[40px] text-[#F4EC97] font bold">{`$ ${1}`}</p>
                        <p className="text-sm text-white/50">{`~ ${0.1} ETH`}</p>
                    </div>
                    <div className="self-end">
                        <img className="" src={icons.tchest.src} alt="Chest" />
                    </div>
                </div>
                <PrimaryBtn
                    title="Share"
                    onClick={() => {}}
                    rightImage={icons.shareBtnIcon}
                />
                <SecondaryBtn
                    title="Claim"
                    onClick={() => connect()}
                    rightImage={icons.downloadBtnIcon}
                />
            </div>
        </div>
    );
};
export default ShareLink;
