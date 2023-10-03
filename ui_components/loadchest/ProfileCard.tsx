import "react-toastify/dist/ReactToastify.css";
import "tailwindcss/tailwind.css";

import Image from "next/image";
import Link from "next/link";
import { FC, Fragment, useContext, useEffect, useState } from "react";

import { ACTIONS, GlobalContext } from "../../context/GlobalContext";
import { trimAddress } from "../../utils";
import { icons } from "../../utils/images";
import QrModal from "../QrModal";
import { Listbox, Transition } from "@headlessui/react";
// import { chainSelection } from "../../constants";
import { CHAIN_LIST } from "utils/chain/chains";


export interface IProfileCard {
    profileImage?: string;
    balance: string;
    showActivity: boolean;
    transactionLoading: boolean;
}
export const ProfileCard: FC<IProfileCard> = (props) => {
    const [selectedChain, setSelectedChain] = useState(CHAIN_LIST[0])
    const { transactionLoading } = props;
    const {
        dispatch,
        state: { address, chainSelected },
    } = useContext(GlobalContext);
    const [showQr, setShowQr] = useState(false);

    const copyToClipBoard = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(address);
    };
    useEffect(() => {
        dispatch({
            type: ACTIONS.SET_CHAIN,
            payload: selectedChain
        })
    }, [selectedChain])

    return (
        <>
            <div className="relative w-full h-auto bg-[#0C0421] rounded-lg mb-4 profileBackgroundImage flex-col justify-center items-center text-center pb-2">
                <div className="absolute right-5 top-2 cursor-pointer">
                    <Listbox value={selectedChain} onChange={setSelectedChain}>
                        <Listbox.Button className="relative min-w-[120px] flex items-center justify-between cursor-pointer rounded-lg pl-3 pr-3 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm border border-slate-400">
                            <span className="block truncate text-slate-400">{selectedChain.name}</span>
                            <Image src={icons.chevronDown} alt="more chains" />
                        </Listbox.Button>
                        <Transition as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0">
                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-slate-600 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {CHAIN_LIST.map((chain, index) => (
                                    <Listbox.Option
                                        key={index}
                                        className={({ active }) =>
                                            `relative cursor-pointer select-none py-2 px-2 rounded-lg ${active ? 'bg-white/20 text-white' : 'text-white'
                                            }`
                                        }
                                        value={chain}
                                    >
                                        {({ selected }) => (
                                            <>
                                                <span
                                                    className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                        }`}
                                                >
                                                    {chain.name}
                                                </span>
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </Listbox>
                </div>
                <div className="pt-2">
                    <Image
                        src={
                            address
                                ? `https://effigy.im/a/${address}.png`
                                : icons.loadAvatar
                        }
                        alt="profile image"
                        width={50}
                        height={50}
                        className="w-12 h-12 rounded-full mx-auto border-white/50 border"
                    />
                </div>
                <p className="text-sm mx-auto pt-1 text-white/50">My Smart Wallet</p>
                {transactionLoading ? (
                    <div className="w-20 h-3 my-2 animate-pulse bg-white/10 rounded-lg mx-auto"></div>
                ) : (
                    <p className="text-sm text-white pb-2">{`${trimAddress(address)}`}</p>
                )}

                <div className="flex justify-around w-[100px] mx-auto pb-1">
                    <Image
                        src={icons.copyIconWhite}
                        alt="copy address"
                        className="w-5 cursor-pointer opacity-60 hover:opacity-100"
                        onClick={copyToClipBoard}
                    />
                    <Image
                        src={icons.qrWhite}
                        alt="show qr code"
                        className="w-5 cursor-pointer opacity-60 hover:opacity-100"
                        onClick={() => {
                            setShowQr(!showQr);
                        }}
                    />
                    <Link
                        href={`https://goerli.basescan.org/address/${address}`}
                        target="_blank"
                    >
                        <Image
                            src={icons.linkWhite}
                            alt="external link"
                            className="w-5 cursor-pointer opacity-60 hover:opacity-100"
                        />
                    </Link>
                </div>
                <Link href={"https://safe.global/"} target="_blank">
                    <p className="inline text-[10px] text-white/50">Powered by: </p>
                    <Image
                        src={icons.safeLogo}
                        alt="safe logo"
                        className="w-10 inline-block"
                    />
                </Link>

                {/* {showActivity ? (
                    <div className="flex gap-2 items-center justify-center pb-4">
                        <PrimaryBtn
                            title="Send"
                            onClick={() => {}}
                            className="max-w-[155px] text-sm !py-2 "
                        />
                        <SecondaryBtn
                            title="Deposit"
                            onClick={() => {}}
                            className="max-w-[155px] text-sm !py-2 text-[#1ACDA2] border-[#1ACDA2] font-medium"
                        />
                    </div>
                ) : null} */}
            </div>
            {/* {showActivity ? (
                <div>
                    <p className="text-white/50">Activity</p>
                </div>
            ) : null} */}

            <QrModal open={showQr} setOpen={setShowQr} address={address} />

        </>
    );
};
