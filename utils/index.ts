import { getStore } from "../store/GlobalStore";
import { ACTIONS, GlobalContext } from "../context/GlobalContext";

export const toastFlashMessage = (
    message: string | React.ReactElement,
    type: string,
    delay = 3000,
) => {
    const { dispatch } = getStore();
    dispatch({
        type: ACTIONS.CLEAR_TOAST,
        payload: {
            message: "",
            toastType: "",
        },
    });
    setTimeout(function () {
        dispatch({
            type: ACTIONS.SHOW_TOAST,
            payload: {
                message: message,
                toastType: type,
            },
        });
        setTimeout(function () {
            dispatch({
                type: ACTIONS.HIDE_TOAST,
                payload: {},
            });
        }, delay);
    }, 200);
};

export const numHex = (num: number) => {
    return hexFormatter(num.toString(16));
};

export const hexFormatter = (hex: string) => {
    let a = hex;
    if (a.length % 2 > 0) {
        a = "0" + a;
    }
    return a;
};

export const hexToBuffer = (hex: string) => {
    if (!hex.startsWith("0x")) {
        hex = "0x" + hex;
    }
    return Buffer.from(hex, "hex");
};

export const hexToNumber = (val: string, divider = 1) => {
    return parseInt(val, 16) / divider;
};
