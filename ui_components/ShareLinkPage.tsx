import * as React from "react";
import { FC } from "react";
import PrimaryBtn from "./PrimaryBtn";
import SecondaryBtn from "./SecondaryBtn";
import { icons } from "../utils/images";

export interface IShareLink {
    amount: number;
    tokenSymbol: string;
    tokenAmount: number;
}

const ShareLink: FC<IShareLink> = (props) => {
    const { amount, tokenSymbol, tokenAmount } = props;
    return (
        <div className="w-full h-full relative">
            <div className="w-full h-[70%] text-center p-4  flex flex-col gap-5 relative top-[25%] items-center">
                <p className="text-white text-[16px]">Your chest is ready</p>
                <div className="w-full h-[300px] rounded-lg shareLinkBg flex flex-col justify-between mb-16">
                    <div className="flex gap-1 flex-col text-start ml-3">
                        <p className="text-[40px] text-[#F4EC97] font bold">{`$ ${amount}`}</p>
                        <p className="text-sm text-white/50">{`~ ${tokenAmount} ${tokenSymbol}`}</p>
                    </div>
                    <div className="self-end">
                        <img className="" src={icons.tchest.src} alt="Chest" />
                    </div>
                </div>
                <PrimaryBtn
                    title="Share"
                    onClick={() => {}}
                    rightImage={icons.shareBtnIcon}
                />
                <SecondaryBtn
                    title="Claim"
                    onClick={() => {}}
                    rightImage={icons.downloadBtnIcon}
                />
            </div>
        </div>
    );
};
export default ShareLink;
