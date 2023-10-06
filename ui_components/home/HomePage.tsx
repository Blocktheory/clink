import {
    GateFiSDK,
    GateFiDisplayModeEnum,
    GateFiEventTypes,
} from "@gatefi/js-sdk";
import { getNetwork } from "@wagmi/core";
import Image from "next/image";
import * as React from "react";

import { icons } from "../../utils/images";
import PrimaryBtn from "../PrimaryBtn";

interface IHome {
    handleSetupChest: () => void;
    loader?: boolean;
}

export default function HomePage(props: IHome) {
    const { handleSetupChest, loader } = props;

    return (
        <div className="h-[100vh] w-full">
            {loader ? (
                <div className="h-full flex flex-col items-center justify-center">
                    <div className="spinnerLoader"></div>

                    <p className=" mt-5 opacity-50 mb-14 text-[16px] leading-14 text-[#131245]">
                        Setting up!
                    </p>
                </div>
            ) : (
                <div className="w-full text-center items-center p-2 flex-col">
                    <h1 className="hero_text mt-12 text-[32px] leading-3 font-bold text-[#131245]">
                        Share crypto rewards <br /> in just a link
                    </h1>
                    <p className="md:heading3_regular mt-5 opacity-50 mb-2 text-[16px] leading-14 text-[#131245]">
                        Load a chest with tokens or nfts that can be <br /> claimed by
                        anyone you share the link with
                    </p>
                    <div>
                        <Image className="m-auto mb-10 relative z-0 w-[30%]" src={icons.tchest} alt="Chest" />
                    </div>
                    <div id="overlay-button">
                        <PrimaryBtn
                            title="Setup a Treasure Chest"
                            onClick={() => handleSetupChest()}
                            className="custom-shadow-lg"
                            shadowLarge={true}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
