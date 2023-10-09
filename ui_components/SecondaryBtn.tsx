import Image from "next/image";
import React, { FC } from "react";

import { TImages, TNextImage } from "../utils/images";
import { icons } from "../utils/images";

interface ISecondaryBtn {
  title: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  leftImage?: TNextImage | TImages;
  rightImage?: TNextImage | TImages | string;
  className?: string;
  showShareIcon?: boolean;
  btnDisable?: boolean;
  loading?: boolean;
  shadowLarge?: boolean;
}

export default function SecondaryBtn(props: ISecondaryBtn) {
  const {
    title,
    onClick,
    rightImage,
    leftImage,
    showShareIcon,
    className,
    btnDisable,
    loading,
    shadowLarge,
  } = props;
  return (
    <button
      className={`py-4 text-[#010101] support_text_bold rounded-lg flex gap-1 items-center w-full justify-center border border-[#010101] max-w-[400px] mx-auto ${
        shadowLarge ? "custom-shadow-lg" : "custom-shadow-sm"
      } ${className}`}
      disabled={btnDisable}
      onClick={onClick}
    >
      {leftImage && !loading && <Image src={leftImage} alt="left-btn-image" />}
      {!loading && title}
      {!loading && rightImage && (
        <Image src={rightImage ?? ""} alt="right-image" className="w-3" />
      )}
      {loading && (
        <div className="bouncing-loader">
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}
    </button>
  );
}
