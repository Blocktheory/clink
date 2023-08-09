import backIcon from "../../public/assets/images/back_icon.png";
import profileCardBg from "../../public/assets/images/bg_card_topology.svg";
import chevronRight from "../../public/assets/images/chevron_right.svg";
import copyBlack from "../../public/assets/images/copy_black.svg";
import downloadBtnIcon from "../../public/assets/images/download_btn_icon.svg";
import downloadBtnIconBlack from "../../public/assets/images/download_btn_icon_black.svg";
import ethLogo from "../../public/assets/images/eth_logo.svg";
import googleIcon from "../../public/assets/images/google_icon.svg";
import hamburgerBlack from "../../public/assets/images/hamburger_black.svg";
import helpIcon from "../../public/assets/images/help_icon.svg";
import linkedinBlue from "../../public/assets/images/linkedin_blue.svg";
import logo from "../../public/assets/images/logo.svg";
import logoutIcon from "../../public/assets/images/logout_icon.svg";
import shareBtnIcon from "../../public/assets/images/share_btn_icon.svg";
import shareBtnIconWhite from "../../public/assets/images/share_btn_icon_white.svg";
import tchest from "../../public/assets/images/tchest.svg";
import telegramBlue from "../../public/assets/images/telegram_blue.svg";
import tokensLoading from "../../public/assets/images/tokens_loading.png";
import transferIcon from "../../public/assets/images/transfer_icon.svg";
import walletIcon from "../../public/assets/images/wallet_btn_image.svg";
import x from "../../public/assets/images/x.svg";

export type TImages =
    | "logo"
    | "tchest"
    | "walletIcon"
    | "backIcon"
    | "shareBtnIcon"
    | "transferIcon"
    | "tokensLoading"
    | "hamburgerBlack"
    | "googleIcon"
    | "chevronRight"
    | "copyBlack"
    | "logoutIcon"
    | "helpIcon"
    | "downloadBtnIcon"
    | "downloadBtnIconBlack"
    | "shareBtnIconWhite"
    | "profileCardBg"
    | "x"
    | "telegramBlue"
    | "linkedinBlue"
    | "ethLogo";

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
    tokensLoading,
    hamburgerBlack,
    googleIcon,
    chevronRight,
    copyBlack,
    logoutIcon,
    helpIcon,
    ethLogo,
    downloadBtnIconBlack,
    shareBtnIconWhite,
    profileCardBg,
    x,
    linkedinBlue,
    telegramBlue,
};