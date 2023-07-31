import React, { useEffect, useMemo, useState } from "react";
import HomePage from "../ui_components/home/HomePage";
import "./globals.css";
import OpenLogin from "@toruslabs/openlogin";
import { baseGoerli, projectId } from "../constants/base";
import { Wallet } from "../utils/wallet";
import { initWasm } from "@trustwallet/wallet-core";

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
    }, []);

    const signIn = async () => {
        try {
            const privKey = await openlogin.login({
                loginProvider: "google",
                redirectUrl: `${window.origin}`,
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
        await openlogin.logout();
    };

    return (
        <div className="flex min-h-screen flex-row items-center justify-between p-4 realtive">
            <HomePage />
            {/* <button className="btn" type="button" onClick={signIn}>
                SignIn
            </button>
            <button className="btn" type="button" onClick={signOut}>
                SignOut
            </button> */}
        </div>
    );
}
