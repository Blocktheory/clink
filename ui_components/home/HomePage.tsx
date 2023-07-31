import * as React from "react";
import PrimaryBtn from "../PrimaryBtn";
import { icons } from "../../utils/images";

export default function HomePage() {
    return (
        <div className="w-full text-center p-2">
            <img className="m-auto" src={icons.logo.src} alt="Logo" />
            <h1 className="hero_text mt-10 text-[32px] leading-2 font-bold">
                Share crypto rewards <br /> in just a link
            </h1>
            <p className="md:heading3_regular mt-5 opacity-50 mb-14 text-[16px] leading-1 text-white">
                Load a chest with tokens or nfts that can be <br /> claimed by anyone you
                share the link with
            </p>
            <img className="m-auto mb-20" src={icons.tchest.src} alt="Chest" />
            <PrimaryBtn title="Set up a Treasure Chest!" />
        </div>
    );
}
