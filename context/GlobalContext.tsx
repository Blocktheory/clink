import { createContext, Dispatch, ReactNode, useReducer } from "react";
import { saveStore } from "../store/GlobalStore";

export enum ACTIONS {
    CLEAR_TOAST = "CLEAR_TOAST",
    SHOW_TOAST = "SHOW_TOAST",
    HIDE_TOAST = "HIDE_TOAST",
}

export type TInitialStateType = {
    toastLists: Array<TToastType> | [];
};

export type TActionType = {
    type: string;
    payload: unknown;
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
