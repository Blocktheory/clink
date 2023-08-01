import * as React from "react";
import PrimaryBtn from "../PrimaryBtn";
import Image from "next/image";
import { icons } from "../../utils/images";
interface IHeader {
    walletAddress: string;
    signIn: () => Promise<void>;
}
const Header = (props: IHeader) => {
    const { walletAddress, signIn } = props;
    return (
        <div className="fixed top-0 md:top-20 w-[90%] max-w-[600px] left-1/2 -translate-x-1/2 h-[64px] rounded-2xl bg-[#0C0421] flex items-center justify-between text-center">
            <div className="flex gap-2 px-4">
                <Image src={icons.logo} alt="logo" className="w-12" />
                <p className="text-[16px] font-bold text-white self-center">Micropay</p>
            </div>
            <div className="flex gap-4 items-center px-4">
                <button
                    type="button"
                    className="w-[90px] h-[40px] rounded-lg bg-white flex gap-2 items-center justify-center"
                    onClick={signIn}
                >
                    <Image src={icons.googleIcon} alt="google login" className="w-5" />
                    <span className="text-[16px] font-medium text-black/50 self-center my-auto">
                        Login
                    </span>
                </button>
                <button
                    type="button"
                    className="w-[40px] h-[40px] rounded-lg bg-white flex items-center justify-center"
                >
                    <Image
                        src={icons.hamburgerBlack}
                        alt="more options"
                        className="w-6"
                    />
                </button>
            </div>
        </div>
    );
};
export default Header;
