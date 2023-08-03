import { FC, useEffect, useMemo, useState } from "react";
import PrimaryBtn from "../PrimaryBtn";
import { useWagmi } from "../../utils/wagmi/WagmiContext";
import { parseEther } from "viem";
export interface IDepositAmountComponent {
    tokenPrice: string;
    walletAddress: string;
    isConnectedToWallet: boolean;
}
export const DepositAmountComponent: FC<IDepositAmountComponent> = (props) => {
    const { tokenPrice, walletAddress } = props;
    const {
        connect,
        fetchBalance,
        baseGoerli,
        injectConnector,
        sendTransaction,
        getAccount,
    } = useWagmi();

    const [value, setValue] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [isConnectedToWallet, setIsConnectedToWallet] = useState(false);

    const handleInputChange = (val: string) => {
        setValue(val);
        const tokenIputValue = Number(val) / Number(tokenPrice);
        console.log(tokenIputValue, "input value");
        setInputValue(String(tokenIputValue));
    };

    useMemo(async () => {
        const account = await getAccount();
        setIsConnectedToWallet(account.isConnected);
    }, []);

    const handleDepositClick = async () => {
        const toAmount = Number(inputValue) * Math.pow(10, 18);
        const result = isConnectedToWallet
            ? await sendTransaction({
                  to: walletAddress,
                  value: parseEther(inputValue),
              })
            : await connect({
                  chainId: baseGoerli.id,
                  connector: injectConnector,
              });
        console.log(result, "result");
    };

    return (
        <div>
            <div className="w-full mt-5 p-5">
                <div className="relative rounded-lg border bg-white/5 border-gray-500  h-auto  p-4">
                    <div className="flex items-center justify-center">
                        <div>
                            <div className="flex items-center justify-center">
                                <p className="text-[32px] text-black">$</p>
                                <input
                                    name={"usd value"}
                                    style={{ caretColor: "black" }}
                                    inputMode="decimal"
                                    type="number"
                                    className={`dollorInput pl-0 pt-2 pb-1 backdrop-blur-xl text-[32px] border-none text-center bg-transparent text-black dark:text-textDark-900 placeholder-black dark:placeholder-textDark-300 rounded-lg block w-full focus:outline-none focus:ring-transparent`}
                                    placeholder={"0"}
                                    autoFocus={true}
                                    value={value}
                                    onChange={(e) => {
                                        handleInputChange(`${e.target.value}`);
                                    }}
                                    onWheel={() =>
                                        (document.activeElement as HTMLElement).blur()
                                    }
                                />
                            </div>
                            <p className="text-black text-[12px] leading-[14px] text-center">
                                ~ {inputValue} ETH
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-5">
                    <PrimaryBtn
                        title={isConnectedToWallet ? "Deposit Amount" : "Connect Wallet"}
                        onClick={() => handleDepositClick()}
                    />
                </div>
            </div>
        </div>
    );
};
