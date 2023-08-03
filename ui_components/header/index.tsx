import * as React from "react";
import PrimaryBtn from "../PrimaryBtn";
import Image from "next/image";
import { icons } from "../../utils/images";
import { trimAddress } from "../../utils";
import { ESteps, LOGGED_IN } from "../../pages";
import BackBtn from "../BackBtn";
import { useContext, useState, useRef, useEffect, useMemo } from "react";
import { ACTIONS, GlobalContext } from "../../context/GlobalContext";
import Link from "next/link";
import { useWagmi } from "../../utils/wagmi/WagmiContext";
interface IHeader {
    walletAddress: string;
    signIn: () => Promise<void>;
    handleSteps: (step: number) => void;
    step: number;
    onHamburgerClick: () => void;
    signOut: () => Promise<void>;
}

const Header = (props: IHeader) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const { walletAddress, signIn, step, handleSteps, onHamburgerClick, signOut } = props;
    const {
        dispatch,
        state: { googleUserInfo, address, isConnected, loggedInVia },
    } = useContext(GlobalContext);
    const [copyText, setCopyText] = useState("Copy Address");
    const [opacity, setOpacity] = useState(false);
    const { disconnect } = useWagmi();

    const copyToClipBoard = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(address);
        setCopyText("Address copied");
        setTimeout(() => {
            setCopyText("Copy Address");
        }, 4000);
    };

    const handleLogout = () => {
        signOut();
        setOpacity(false);
    };

    const handleClick = () => {
        setOpacity(!opacity);
        onHamburgerClick();
    };

    const handleClickOutside = (e: any) => {
        if (menuRef.current && !menuRef?.current?.contains(e.target)) {
            setOpacity(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const handleDisConnect = async () => {
        await disconnect();
        handleSteps(ESteps.ONE);
        dispatch({
            type: ACTIONS.LOGOUT,
            payload: "",
        });
    };

    return (
        <header className="relative z-[9]">
            <div className="h-[80px] hidden md:block"></div>
            <div className="sticky top-0 flex items-center justify-center">
                <div className="w-[90%] max-w-[600px] h-[64px] rounded-2xl bg-[#0C0421] text-center flex items-center justify-between relative z-[9]">
                    {step > 1 ? (
                        <div className="ml-4">
                            <BackBtn
                                onClick={() => handleSteps(step === 3 ? 1 : step - 1)}
                            />
                        </div>
                    ) : (
                        <div className="flex gap-2 px-4">
                            <Image src={icons.logo} alt="logo" className="w-12" />
                            <p className="text-[16px] font-bold text-white self-center">
                                Micropay
                            </p>
                        </div>
                    )}

                    <div className="flex gap-4 items-center px-4">
                        <button
                            className={`px-4 h-[40px] rounded-lg bg-white flex gap-2 items-center justify-center`}
                            onClick={signIn}
                            disabled={isConnected}
                        >
                            <Image
                                src={
                                    !isConnected
                                        ? icons.googleIcon
                                        : loggedInVia === LOGGED_IN.GOOGLE
                                        ? googleUserInfo.profileImage
                                        : icons.ethLogo
                                }
                                alt="google login"
                                width={20}
                                height={20}
                                className="w-5 rounded-full"
                            />
                            <span className="text-[16px] font-medium text-black/50 self-center my-auto">
                                {address ? trimAddress(address) : "Login"}
                            </span>
                        </button>
                        <div className="relative" ref={menuRef}>
                            <button
                                type="button"
                                className="w-[40px] h-[40px] rounded-lg bg-white flex items-center justify-center "
                            >
                                <Image
                                    src={icons.hamburgerBlack}
                                    alt="more options"
                                    className="w-6 "
                                    onClick={handleClick}
                                />
                                {opacity ? (
                                    <div className="absolute top-12 bg-[#f5f5f5] rounded-lg hidden lg:block">
                                        <div className="min-w-[280px]">
                                            {address ? (
                                                <>
                                                    <div className="flex justify-between items-center px-4 py-3">
                                                        <div>
                                                            <p className="text-[12px] font-medium text-[#555555]">
                                                                ACCOUNT OVERVIEW
                                                            </p>
                                                            <p className="text-black">
                                                                {address
                                                                    ? trimAddress(address)
                                                                    : ""}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="w-[95%] h-[52px] bg-white rounded-lg mx-auto flex justify-between items-center px-4 mb-6 cursor-pointer"
                                                        onClick={copyToClipBoard}
                                                    >
                                                        <p className="text-black">
                                                            {copyText}
                                                        </p>
                                                        <Image
                                                            src={icons.copyBlack}
                                                            alt="copy icon"
                                                        />
                                                    </div>
                                                    {isConnected &&
                                                        loggedInVia ===
                                                            LOGGED_IN.EXTERNAL_WALLET && (
                                                            <div
                                                                className="w-[95%] h-[52px] bg-white rounded-lg mx-auto flex justify-between items-center px-4 mb-6"
                                                                onClick={() => {
                                                                    handleDisConnect();
                                                                }}
                                                            >
                                                                <p className="text-[#E11900]">
                                                                    Disconnect Wallet
                                                                </p>
                                                            </div>
                                                        )}
                                                </>
                                            ) : null}

                                            <div className="bg-white w-full px-4">
                                                {!googleUserInfo ? (
                                                    <div
                                                        className="flex justify-between items-center py-6 border-b-2 cursor-pointer"
                                                        onClick={signIn}
                                                    >
                                                        <div className="flex gap-2 items-center">
                                                            <Image
                                                                src={icons.googleIcon}
                                                                alt="login with google"
                                                            />
                                                            <p className="text-black">
                                                                Login with Google
                                                            </p>
                                                        </div>
                                                        <Image
                                                            src={icons.chevronRight}
                                                            alt="login with google"
                                                        />
                                                    </div>
                                                ) : null}

                                                <Link
                                                    href="mailto:contact@blocktheory.com"
                                                    target="_blank"
                                                    onClick={() => {
                                                        setOpacity(false);
                                                    }}
                                                >
                                                    <div className="flex justify-between items-center py-6 border-b-2">
                                                        <div className="flex gap-2 items-center">
                                                            <Image
                                                                src={icons.helpIcon}
                                                                alt="help"
                                                            />
                                                            <p className="text-black">
                                                                Help
                                                            </p>
                                                        </div>
                                                        <Image
                                                            src={icons.chevronRight}
                                                            alt="login with google"
                                                        />
                                                    </div>
                                                </Link>
                                                {isConnected &&
                                                loggedInVia === LOGGED_IN.GOOGLE ? (
                                                    <div
                                                        className="flex justify-between items-center py-6 cursor-pointer"
                                                        onClick={handleLogout}
                                                    >
                                                        <div className="flex gap-2 items-center">
                                                            <Image
                                                                src={icons.googleIcon}
                                                                alt="login with google"
                                                            />
                                                            <p className="text-black">
                                                                Logout
                                                            </p>
                                                        </div>
                                                        <Image
                                                            src={icons.logoutIcon}
                                                            alt="logout"
                                                        />
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
export default Header;
