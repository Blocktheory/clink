import { ReactNode, createContext, useContext } from "react";
import { WagmiHoc } from ".";
import { useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { ConnectArgs } from "wagmi/actions";

interface IProps {
    children?: ReactNode;
}

export type TGlobalContextType = {
    connect?: (args?: Partial<ConnectArgs> | undefined) => void;
};

export const WalletContext = createContext<TGlobalContextType>({
    connect: undefined,
});

const WagmiProvider = ({ children }: IProps) => {
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    });

    return (
        <WalletContext.Provider value={{ connect }}>{children}</WalletContext.Provider>
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
    const { connect } = useContext(WalletContext);
    return { connect };
};

export { useWagmi, WagmiWrapper };
