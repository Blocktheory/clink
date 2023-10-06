import Image from "next/image";
import React, { FC } from "react";

import { TImages, TNextImage } from "../utils/images";
import { icons } from "../utils/images";

interface IPrimaryBtn {
    title: string;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    leftImage?: TNextImage | TImages | string;
    rightImage?: TNextImage | TImages | string;
    showShareIcon?: boolean;
    className?: string;
    btnDisable?: boolean;
    loading?: boolean;
    shadowLarge?: boolean;
}

export default function PrimaryBtn(props: IPrimaryBtn) {
    const { title, onClick, rightImage, showShareIcon, className, btnDisable, loading, shadowLarge, leftImage } =
        props;
    return (
        <button
            className={`py-4 btnBg support_text_bold rounded-lg flex gap-1 items-center w-full justify-center my-0 mx-auto max-w-[400px] border border-[#010101] text-[#010101] ${shadowLarge ? "custom-shadow-lg" : "custom-shadow-sm"} ${className ?? ""}`}
            onClick={onClick}
            disabled={btnDisable}
        >
            {leftImage && !loading && <Image src={leftImage} alt="btn-left-image" className="w-5 h-5 rounded-full mr-2" />}
            {!loading && title}
            {rightImage && !loading ? (
                <Image src={rightImage ?? ""} alt="right-image" className="w-5 h-5" />
            ) : null}
            {loading && (
                <div className="bouncing-loader-black">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            )}
        </button>
    );
}
