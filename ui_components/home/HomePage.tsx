import * as React from "react";
import PrimaryBtn from "../PrimaryBtn";
import { icons } from "../../utils/images";
import { ACTIONS, GlobalContext } from "../../context/GlobalContext";

export default function HomePage(props: any) {
    const {
        dispatch,
        state: { address },
    } = React.useContext(GlobalContext);
    const { signIn, walletAddress } = props;

    React.useMemo(() => {
        if (walletAddress) {
            dispatch({
                type: ACTIONS.SET_ADDRESS,
                payload: walletAddress,
            });
        }
    }, [walletAddress]);

    console.log("address", address);
    console.log("walletAddress", walletAddress);

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
            <p className="text-red-500">{walletAddress ? walletAddress : address}</p>
            <PrimaryBtn title="Setup a Tresure Chest" onClick={signIn} />
        </div>
    );
}
