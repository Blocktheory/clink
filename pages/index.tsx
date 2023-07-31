import React, { useMemo, useState } from "react";
import HomePage from "../ui_components/home/HomePage";
import ConnectWallet from "../ui_components/connect_wallet/";
import "./globals.css";
import OpenLogin from "@toruslabs/openlogin";
import { baseGoerli, projectId } from "../constants/base";
import { Wallet } from "../utils/wallet";
import { initWasm } from "@trustwallet/wallet-core";
import { LoadChestComponent } from "../ui_components/LoadChest/LoadChestComponent";

export type THandleStep = {
    handleSteps: (step: number) => void;
};

export enum ESteps {
    ONE = 1,
    TWO = 2,
    THREE = 3,
    FOUR = 4,
    FIVE = 5,
}

export default function Home() {
    const [openlogin, setSdk] = useState<any>("");
    const [walletAddress, setWalletAddress] = useState<string>("");
    const [step, setStep] = useState<number>(1);

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
            await openlogin.login({
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
        setWalletAddress(address);
        handleSteps(ESteps.THREE);
    };

    const signOut = async () => {
        await openlogin.logout();
    };

    const handleSteps = (step: number) => {
        setStep(step);
    };

    const getUIComponent = (step: number) => {
        switch (step) {
            case ESteps.ONE:
                return <HomePage handleSteps={handleSteps} />;
            case ESteps.TWO:
                return <ConnectWallet signIn={signIn} handleSteps={handleSteps} />;
            case ESteps.THREE:
                return <LoadChestComponent />;
            case ESteps.FOUR:
                return <ConnectWallet signIn={signIn} handleSteps={handleSteps} />;
            case ESteps.FIVE:
                return <ConnectWallet signIn={signIn} handleSteps={handleSteps} />;
            default:
                return <HomePage handleSteps={handleSteps} />;
        }
    };

    return (
        <div className="flex min-h-screen flex-row items-center justify-between p-4 relative">
            {getUIComponent(step)}
        </div>
    );
}
