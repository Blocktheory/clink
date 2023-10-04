import { connect, fetchBalance, getAccount } from "@wagmi/core";
import { createContext, ReactNode, useContext } from "react";
import { ConnectArgs, disconnect, sendTransaction } from "wagmi/actions";
import { baseGoerli, optimismGoerli } from "wagmi/chains";
import { InjectedConnector } from "wagmi/connectors/injected";

import { WagmiHoc } from ".";

interface IProps {
    children?: ReactNode;
}

export const supportedChains = [baseGoerli, optimismGoerli]

export type TGlobalContextType = {
    connect?: any;
    fetchBalance?: any;
    baseGoerli?: any;
    supportedChains?: any;
    InjectedConnector?: any;
    getAccount?: any;
    disconnect?: any;
};

export const WalletContext = createContext<TGlobalContextType>({
    connect: undefined,
});

const WagmiProvider = ({ children }: IProps) => {
    return (
        <WalletContext.Provider
            value={{
                connect,
                fetchBalance,
                // baseGoerli,
                supportedChains,
                InjectedConnector,
                getAccount,
                disconnect,
            }}
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
    const {
        connect,
        fetchBalance,
        // baseGoerli,
        supportedChains,
        InjectedConnector,
        getAccount,
        disconnect,
    } = useContext(WalletContext);
    const injectConnector = new InjectedConnector({ chains: supportedChains });
    return {
        connect,
        fetchBalance,
        // baseGoerli,
        supportedChains,
        InjectedConnector,
        injectConnector,
        sendTransaction,
        getAccount,
        disconnect,
    };
};

export { useWagmi, WagmiWrapper };
