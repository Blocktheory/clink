import logo from "../../public/assets/images/logo.svg";
import tchest from "../../public/assets/images/tchest.svg";
import walletIcon from "../../public/assets/images/wallet_btn_image.svg";
import shareBtnIcon from "../../public/assets/images/share_btn_icon.svg";
import downloadBtnIcon from "../../public/assets/images/download_btn_icon.svg";
import backIcon from "../../public/assets/images/back_icon.png";
import transferIcon from "../../public/assets/images/transfer_icon.svg";

export type TImages =
    | "logo"
    | "tchest"
    | "walletIcon"
    | "backIcon"
    | "shareBtnIcon"
    | "transferIcon"
    | "downloadBtnIcon";

export type TNextImage = {
    src: string;
    height: number;
    width: number;
};

export const icons: Record<TImages, TNextImage> = {
    logo,
    tchest,
    walletIcon,
    backIcon,
    shareBtnIcon,
    transferIcon,
    downloadBtnIcon,
};
