import logo from "../../public/assets/images/logo.svg";
import tchest from "../../public/assets/images/tchest.svg";

export type TImages = "logo" | "tchest";

export type TNextImage = {
    src: string;
    height: number;
    width: number;
};

export const icons: Record<TImages, TNextImage> = {
    logo,
    tchest,
};
