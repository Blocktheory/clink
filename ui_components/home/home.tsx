import { Keypair } from "@solana/web3.js";
import OpenLogin from "@toruslabs/openlogin";
import { getED25519Key } from "@toruslabs/openlogin-ed25519";
import { useEffect, useState } from "react";

import { baseGoerli, loginProvider, projectId } from "../../constants/base";

export default function Home() {
    const [openlogin, setSdk] = useState<any>("");
    const [solanPublicKey, setSolanaPublicKey] = useState("");
    const [solanaPrivateKey, setPrivateKey] = useState<any>("");

    useEffect(() => {
        async function initializeOpenlogin() {
            const sdkInstance = new OpenLogin({
                clientId: projectId,
                // @ts-ignore
                network: baseGoerli.networks.testnet.displayName,
            });
            await sdkInstance.init();
            if (sdkInstance.privKey) {
                const privateKey = sdkInstance.privKey;
                const secretKey = getSolanaPrivateKey(privateKey);
                await getAccountInfo(secretKey);
            }
            setSdk(sdkInstance);
        }
        initializeOpenlogin();
    }, []);

    const getSolanaPrivateKey = (openloginKey: any) => {
        const { sk } = getED25519Key(openloginKey);
        return sk;
    };

    const getAccountInfo = async (secretKey: any) => {
        const account = Keypair.fromSecretKey(secretKey);
        setSolanaPublicKey(account.publicKey.toBase58());
        setPrivateKey(account.secretKey);
        return account;
    };

    const handleLogin = async () => {
        try {
            const privKey = await openlogin.login({
                loginProvider: loginProvider.google,
                redirectUrl: `${window.origin}`,
            });
            const solanaPrivateKey = getSolanaPrivateKey(privKey);
            await getAccountInfo(solanaPrivateKey);
        } catch (error) {
            console.log("error", error);
        }
    };

    const handleLogout = async () => {
        await openlogin?.logout();
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="loginContainer">
                {openlogin && openlogin?.privKey ? (
                    <div>
                        solanPublicKey : {solanPublicKey} <br />
                        solanaPrivateKey : {solanaPrivateKey}
                    </div>
                ) : (
                    <>
                        <h1 style={{ textAlign: "center" }}>Openlogin</h1>
                        <button
                            type="button"
                            onClick={() => handleLogin()}
                            className="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={() => handleLogout()}
                            className="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </main>
    );
}
