import * as React from "react";
import { icons } from "../../utils/images";
import Image from "next/image";

export default function LoadingTokenPage() {
    return (
        <div className="w-full h-full relative flex flex-col text-center items-center gap-20">
            <p className="text-white heading2 text-[32px] ">Loading Chest...</p>
            <Image src={icons.tokensLoading} alt="tokens image" />
            <Image src={icons.tchest} alt="treasure chest" />
        </div>
    );
}
