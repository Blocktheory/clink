import React, { FC } from "react";
import { TImages, TNextImage } from "../utils/images";
import { icons } from "../utils/images";
import Image from "next/image";

interface ISecondaryBtn {
    title: string;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    leftImage?: Record<TImages, TNextImage>;
    rightImage?: TNextImage | TImages;
}

export default function SecondaryBtn(props: ISecondaryBtn) {
    const { title, onClick, rightImage } = props;
    return (
        <button
            className="py-4 support_text_bold text-white rounded-lg flex gap-1 items-center w-[80%] justify-center border border-white bg-white/10"
            onClick={onClick}
        >
            {title}
            <Image src={rightImage ?? ""} alt="right-image" />
        </button>
    );
}
