import React, { useMemo, useState } from "react";
import {
    modalConfig,
    openLoginAdapter,
    options,
    web3AuthModalPack,
} from "../auth/config";
import HomePage from "../ui_components/home/HomePage";
import "./globals.css";
import { ADAPTER_EVENTS } from "@web3auth/base";
import OpenLogin from "@toruslabs/openlogin";
import { baseGoerli, projectId } from "../constants/base";
import { Wallet } from "../utils/wallet";
import { initWasm } from "@trustwallet/wallet-core";
import HomePageNew from "../ui_components/home/HomePageNew";

export default function Home() {
    const [openlogin, setSdk] = useState<any>("");

    useMemo(async () => {
        async function initializeOpenlogin() {
            const sdkInstance = new OpenLogin({
                clientId: projectId,
                network: baseGoerli.networks.testnet.displayName,
                mfaSettings: undefined,
            });
            await sdkInstance.init();
            if (sdkInstance.privKey) {
                console.log("priv key ", sdkInstance.privKey);
                const prvKey = sdkInstance.privKey;
                getAddress(prvKey);
            }
            setSdk(sdkInstance);
        }
        initializeOpenlogin();

        await web3AuthModalPack.init({
            options,
            adapters: [openLoginAdapter],
            modalConfig,
        });
        web3AuthModalPack.subscribe(ADAPTER_EVENTS.CONNECTED, () => {
            console.log("User is authenticated");
        });
        web3AuthModalPack.subscribe(ADAPTER_EVENTS.DISCONNECTED, () => {
            console.log("User is not authenticated");
        });
    }, []);

    const signIn = async () => {
        try {
            const privKey = await openlogin.login({
                loginProvider: "jwt",
                // redirectUrl: `${window.origin}`,
                mfaLevel: "none",
            });
        } catch (error) {
            console.log("error", error);
        }
    };

    const getAddress = async (prvKey: string) => {
        const walletCore = await initWasm();
        const wallet = new Wallet(walletCore);
        const address = await wallet.importWithPrvKey(prvKey);
        console.log("priv key address captured ", address);
    };

    const signOut = async () => {
        await web3AuthModalPack.signOut();
    };

    return (
        <div className="flex container min-h-screen flex-col items-center justify-between p-24">
            <HomePageNew />
            <button className="btn" type="button" onClick={signIn}>
                SignIn
            </button>
            <button className="btn" type="button" onClick={signOut}>
                SignOut
            </button>
        </div>
    );
}
