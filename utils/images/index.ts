import logo from "../../public/assets/images/logo.svg";
import tchest from "../../public/assets/images/tchest.svg";
import walletIcon from "../../public/assets/images/wallet_btn_image.svg";
import backIcon from "../../public/assets/images/back_icon.png";

export type TImages = "logo" | "tchest" | "walletIcon" | "backIcon";

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
};
