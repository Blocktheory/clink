import { ReactNode, createContext, useContext } from "react";
import { WagmiHoc } from ".";
import { ConnectArgs, sendTransaction } from "wagmi/actions";
import { fetchBalance, connect, getAccount } from "@wagmi/core";
import { baseGoerli } from "wagmi/chains";
import { InjectedConnector } from "wagmi/connectors/injected";

interface IProps {
    children?: ReactNode;
}

export type TGlobalContextType = {
    connect?: any;
    fetchBalance?: any;
    baseGoerli?: any;
    InjectedConnector?: any;
    getAccount?: any;
};

export const WalletContext = createContext<TGlobalContextType>({
    connect: undefined,
});

const WagmiProvider = ({ children }: IProps) => {
    return (
        <WalletContext.Provider
            value={{ connect, fetchBalance, baseGoerli, InjectedConnector, getAccount }}
        >
            {children}
        </WalletContext.Provider>
    );
};

const WagmiWrapper = ({ children }: IProps) => {
    return (
        <WagmiHoc>
            <WagmiProvider>{children}</WagmiProvider>
        </WagmiHoc>
    );
};

const useWagmi = () => {
    const { connect, fetchBalance, baseGoerli, InjectedConnector, getAccount } =
        useContext(WalletContext);
    const injectConnector = new InjectedConnector({ chains: [baseGoerli] });
    return {
        connect,
        fetchBalance,
        baseGoerli,
        InjectedConnector,
        injectConnector,
        sendTransaction,
        getAccount,
    };
};

export { useWagmi, WagmiWrapper };
