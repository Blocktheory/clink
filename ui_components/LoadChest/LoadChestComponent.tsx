import Image from "next/image";
import { FC } from "react";
import { icons } from "../../utils/images";
import * as Bip39 from "bip39";
import { Wallet } from "../../utils/wallet";
import { initWasm } from "@trustwallet/wallet-core";
import { useRouter } from "next/router";
import {
    getBalance,
    getEstimatedGas,
    getGasPrice,
    getNonce,
    getSendRawTransaction,
} from "../../apiServices";
import { hexToNumber, numHex } from "../../utils";
import { TRANSACTION_TYPE, TTranx } from "../../utils/wallet/types";

export const LoadChestComponent: FC = () => {
    const router = useRouter();
    const createWallet = async () => {
        try {
            console.log("came to fun");
            const walletCore = await initWasm();
            const wallet = new Wallet(walletCore);
            const link = await wallet.createPayLink();
            console.log(link, "link");
            const address = await wallet.getAccountFromPayLink(link);
            console.log(address, "address");
            const balance = (await getBalance(
                "0x77B7e897EB1ED7C5D5fd5237a5B9CB100B739f1d",
            )) as any;
            console.log(hexToNumber(balance.result as string), "balance");
            const gasPriceData = (await getGasPrice()) as any;
            console.log(hexToNumber(gasPriceData.result), "gasprice");
            const value = 0.01 * Math.pow(10, 18);
            let valueHex = String(numHex(value))
            if (!valueHex.startsWith("0x")) {valueHex = "0x" + valueHex}
            const gasLimitData = (await getEstimatedGas({
                from: "0x77B7e897EB1ED7C5D5fd5237a5B9CB100B739f1d",
                to: address,
                value: valueHex,
            })) as any;
            console.log(hexToNumber(gasLimitData.result), "est gas");
            const nonce = (await getNonce(address)) as any;
            console.log(hexToNumber(nonce.result), "nonce");
            const tx: TTranx = {
                toAddress: address,
                chainId: "1",
                nonceHex: nonce.result,
                chainIdHex: numHex(1),
                gasPriceHex: gasPriceData.result ?? "0x1",
                gasLimitHex: gasLimitData.result,
                amountHex: numHex(value),
                amount: value,
                contractAddress: "",
                contractDecimals: 0,
                fromAddress: "",
                coinType: "",
                transactionType: TRANSACTION_TYPE.SEND,
                isNative: true,
            };
            const txData = await wallet.signEthTx(tx, "");
            console.log(txData, "txData");
            const rawTx = await getSendRawTransaction(txData);
            console.log(rawTx, "raw tx");
        } catch (e: any) {
            console.log(e, "e");
        }
    };
    return (
        <div className="mx-auto">
            <div className="text-center">
                <p className="paragraph text-white/40">STEP 2</p>
                <p className="paragraph_regular text-white">
                    Enter the amount to store in the chest
                </p>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/40 py-2 px-4">
                <div>
                    <p className="paragraph font-normal text-white/40">YOUR BALANCE</p>
                    <div className="flex items-start gap-3 my-2">
                        <Image src={icons.transferIcon} alt="transferIcon" />
                        <div>
                            <p className="text-white text-[24px] font-semibold leading-10 mb-2">
                                $50,000
                            </p>
                            <p className="text-white/30 text-[12px] leading-[14px]">
                                ~3.5 ETH
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Image src={icons.transferIcon} alt="transferIcon" />
                    <p className="text-white text-[24px] font-normal leading-9">ETH</p>
                </div>
            </div>
            <div className="inputBg">
                <div className="rounded-lg border border-gray-500 mt-5  bg-transparent p-4">
                    <div className="flex items-center justify-center">
                        <input
                            name={"usd value"}
                            style={{ caretColor: "white" }}
                            className={`pl-0 pt-2 pb-1 border-none text-center bg-transparent text-white dark:text-textDark-900 placeholder-white dark:placeholder-textDark-300 text-base rounded-lg block w-full focus:outline-none focus:ring-transparent`}
                            placeholder={"$0.00"}
                            autoFocus={true}
                            onWheel={() => (document.activeElement as HTMLElement).blur()}
                        />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-5">
                <div className="rounded-lg border border-gray-500 bg-transparent p-2">
                    <p className="text-center text-white">$1</p>
                </div>
                <div className="rounded-lg border border-gray-500 bg-transparent p-2">
                    <p className="text-center text-white">$2</p>
                </div>
                <div className="rounded-lg border border-gray-500 bg-transparent p-2">
                    <p className="text-center text-white">$3</p>
                </div>
            </div>
            <div className="relative mt-5">
                <div className="absolute left-1/2 top-5 -translate-x-1/2 z-0">
                    <Image src={icons.tchest} alt="chest" />
                </div>
                <div
                    className="relative z-10 bg-gradient-to-r from-teal-400 to-green-500 p-4 rounded-lg text-center"
                    onClick={() => {
                        createWallet();
                    }}
                >
                    Load Chest
                </div>
            </div>
        </div>
    );
};
