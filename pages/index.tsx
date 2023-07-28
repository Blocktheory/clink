import { useMemo } from "react";
import {
    modalConfig,
    openLoginAdapter,
    options,
    web3AuthModalPack,
} from "../auth/config";
import "./globals.css";
import { ADAPTER_EVENTS } from "@web3auth/base";
export default function Home() {
    useMemo(async () => {
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
        const signData = await web3AuthModalPack.signIn();
        const provider = web3AuthModalPack.getProvider();
        const address = await web3AuthModalPack.getAddress();
        debugger;
    };

    const signOut = async () => {
        await web3AuthModalPack.signOut();
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <button className="btn" type="button" onClick={signIn}>
                SignIn
            </button>
            <button className="btn" type="button" onClick={signOut}>
                SignOut
            </button>
        </main>
    );
}
