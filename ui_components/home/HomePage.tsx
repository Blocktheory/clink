import * as React from "react";
import PrimaryBtn from "../PrimaryBtn";
import { icons } from "../../utils/images";
import { ESteps, THandleStep } from "../../pages";

interface IHome extends THandleStep {}

export default function HomePage(props: IHome) {
    const { handleSteps } = props;
    return (
        <div className="w-full text-center items-center p-2 flex-col">
            <img className="m-auto" src={icons.logo.src} alt="Logo" />
            <h1 className="hero_text mt-10 text-[32px] leading-2 font-bold">
                Share crypto rewards <br /> in just a link
            </h1>
            <p className="md:heading3_regular mt-5 opacity-50 mb-14 text-[16px] leading-1 text-white">
                Load a chest with tokens or nfts that can be <br /> claimed by anyone you
                share the link with
            </p>
            <img className="m-auto mb-20" src={icons.tchest.src} alt="Chest" />
            <PrimaryBtn
                title="Setup a Tressure Chest"
                onClick={() => handleSteps(ESteps.TWO)}
            />
        </div>
    );
}
