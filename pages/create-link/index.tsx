import OpenLogin from "@toruslabs/openlogin";
import { getED25519Key } from "@toruslabs/openlogin-ed25519";
import { useEffect, useState } from "react";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import * as React from "react";
import Link from "next/link";

export default function HomePageNew() {
    useEffect(() => {}, []);

    const getSolanaPrivateKey = (openloginKey: any) => {};

    const getAccountInfo = async (secretKey: any) => {};

    const handleLogin = async () => {};

    const handleLogout = async () => {};

    return (
        <div className="bg-white h-[100vh] w-full flex-col text-center relative">
            <div className="relative top-[20%] flex-col text-center">
                <p className="heading1 text-[40px] text-[#010101] font-bold leading-3 mb-10">
                    Create your micopayment link
                </p>
                <p className="text-[20px] leading-1 font-normal mb-10 justify-between">
                    Your payment all within simply a link
                </p>
                <div className="flex gap-5 justify-center items-center relative">
                    <div className="flex-col text-center">
                        <div className="rounded-full w-8 h-8 bg-[#343434] text-white flex items-center justify-center mx-auto mb-4">
                            <p className="text-sm">1</p>
                        </div>
                        <p className="text-[14px] font-semibold">Connect your wallet</p>
                    </div>
                    <div className="w-20 h-[1px] bg-[#343434] relative -top-4"></div>
                    <div>
                        <div className="rounded-full w-8 h-8 bg-[#343434] text-white flex items-center justify-center mx-auto mb-4">
                            <p className="text-sm">2</p>
                        </div>
                        <p className="text-[14px] font-semibold">Enter Amount</p>
                    </div>
                    <div className="w-20 h-[1px] bg-[#343434] relative -top-4"></div>
                    <div>
                        <div className="rounded-full w-8 h-8 bg-[#343434] text-white flex items-center justify-center mx-auto mb-4">
                            <p className="text-sm">3</p>
                        </div>
                        <p className="text-[14px] font-semibold">Share the link</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
