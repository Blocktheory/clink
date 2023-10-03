import { createContext, Dispatch, ReactNode, useReducer } from "react";

import { saveStore } from "../store/GlobalStore";
import { CHAINS_ENUMS, CHAINS_IDS } from "utils/chain";
import { BaseGoerli } from "utils/chain/baseGoerli";

export enum ACTIONS {
    CLEAR_TOAST = "CLEAR_TOAST",
    SHOW_TOAST = "SHOW_TOAST",
    HIDE_TOAST = "HIDE_TOAST",
    SET_ADDRESS = "SET_ADDRESS",
    GOOGLE_USER_INFO = "GOOGLE_USER_INFO",
    LOGGED_IN_VIA = "LOGGED_IN_VIA",
    LOGOUT = "LOGOUT",
    SET_CHAIN = "SET_CHAIN",
}

export type TInitialStateType = {
    toastLists: Array<TToastType> | [];
    address: string;
    googleUserInfo: any;
    loggedInVia: string;
    isConnected: boolean;
    chainSelected: any;
};

export type TActionType = {
    type: string;
    payload: unknown;
};

export type TChainDetail = {
    index: number;
    id: CHAINS_IDS;
    name: string;
    logo: string;
    coinId: number;
    symbol: string;
    chainId: string;
    chainIdHex: string;
    decimals: number;
    blockchain: CHAINS_ENUMS;
    derivation: {
        path: string,
    },
    curve: string;
    publicKeyType: string;
    explorer: {
        url: string;
        explorerName: string;
        txPath: string;
        accountPath: string
    },
    info: {
        url: string;
        rpc: string;
    },

};

type TToastType = {
    message: string;
    toastType: string;
};

interface IProps {
    children?: ReactNode;
}

export type TGlobalContextType = {
    state: TInitialStateType;
    dispatch: Dispatch<TActionType>;
};

const initialState: TInitialStateType = {
    toastLists: [],
    address: "",
    googleUserInfo: {},
    loggedInVia: "",
    isConnected: false,
    chainSelected: BaseGoerli,
};

export const GlobalContext = createContext<TGlobalContextType>({
    state: initialState,
    dispatch: () => null,
});

function reducer(state: TInitialStateType, action: TActionType) {
    switch (action.type) {
        case ACTIONS.SHOW_TOAST: {
            const payload = action.payload as TToastType;
            if (payload.toastType === "error") {
                if (
                    state.toastLists.filter(
                        (toast: TToastType) => toast.toastType === "error",
                    ).length < 1
                ) {
                    return {
                        ...state,
                        toastLists: [
                            ...state.toastLists,
                            ...[
                                {
                                    message: payload.message,
                                    toastType: payload.toastType,
                                },
                            ],
                        ],
                    };
                } else {
                    return state;
                }
            } else {
                return {
                    ...state,
                    toastLists: [
                        ...state.toastLists,
                        ...[{ message: payload.message, toastType: payload.toastType }],
                    ],
                };
            }
        }
        case ACTIONS.CLEAR_TOAST:
            return {
                ...state,
                toastLists: [],
            };
        case ACTIONS.HIDE_TOAST:
            if (state.toastLists) {
                return {
                    ...state,
                    toastLists: [],
                };
            } else {
                return { ...state };
            }
        case ACTIONS.SET_ADDRESS: {
            return {
                ...state,
                address: action.payload as string,
                isConnected: true,
            };
        }
        //type has to be defined
        case ACTIONS.SET_CHAIN: {
            return {
                ...state,
                chainSelected: action.payload as TChainDetail,
                isConnected: true,
            };
        }
        case ACTIONS.GOOGLE_USER_INFO: {
            const { googleUserInfo, isConnected } = action.payload as any;
            return {
                ...state,
                googleUserInfo: googleUserInfo,
                isConnected: isConnected,
            };
        }
        case ACTIONS.LOGGED_IN_VIA: {
            return {
                ...state,
                loggedInVia: action.payload as string,
            };
        }
        case ACTIONS.LOGOUT: {
            return {
                ...state,
                googleUserInfo: {},
                isConnected: false,
                address: "",
            };
        }
        default:
            return state;
    }
}

const GlobalContextProvider = ({ children }: IProps) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    saveStore({ state, dispatch });
    return (
        <GlobalContext.Provider value={{ state, dispatch }}>
            {children}
        </GlobalContext.Provider>
    );
};
export default GlobalContextProvider;
