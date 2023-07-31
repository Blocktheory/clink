import * as React from "react";
import { icons } from "../../utils/images";
import Image from "next/image";
import SecondaryBtn from "../SecondaryBtn";
import { ESteps, THandleStep } from "../../pages";
import BackBtn from "../BackBtn";

interface IConnectWallet extends THandleStep {
    signIn: () => Promise<void>;
}

export default function ConnectWallet(props: IConnectWallet) {
    const { signIn, handleSteps } = props;
    return (
        <div className="w-full h-full relative">
            <BackBtn onClick={() => handleSteps(ESteps.ONE)} />
            <div className="w-full  h-[50%] text-center p-2  flex flex-col gap-10 relative top-[25%] md:left-1/2 md:-translate-x-1/2">
                <div>
                    <p className="text-sm md:text-lg font-bold leading-1 text-white/50 mb-6 md:mb-10">
                        STEP 1
                    </p>
                    <p className="text-lg md:text-xl font-bold leading-1 text-white mb-3 md:mb-10">
                        Connect your wallet
                    </p>
                    <p className="text-sm md:text-lg font-regular leading-1 md:leading-[32px] text-white/50 md:mb-10">
                        Enable access to your wallet to load <br /> your assets to the
                        chest
                    </p>
                </div>
                <img className="m-auto" src={icons.tchest.src} alt="Chest" />

                <div className="flex gap-3 justify-center items-center w-[80%] md:w-[60%] lg:w-[360px] h-[64px] mx-auto rounded-lg">
                    <SecondaryBtn
                        leftImage={icons.walletIcon ?? ""}
                        title={"Connect your wallet"}
                        onClick={signIn}
                    />
                </div>
            </div>
        </div>
    );
}
