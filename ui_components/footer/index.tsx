import Image from "next/image";
import Link from "next/link";

import { icons } from "../../utils/images";
import { SelectedChain } from "../../utils/chain";

const Footer = () => {
    return (
        <footer>
            <Link href={"https://base.org/"} target="_blank">
                <div className="flex gap-2 justify-center items-center fixed bottom-4 left-1/2 -translate-x-1/2">
                    <p className="text-[12px] text-white">Built on:</p>
                    <Image src={SelectedChain.logo} width={20} height={20} alt="built on base" />
                    <p className="text-[14px] font-medium text-white">{SelectedChain.name}</p>
                </div>
            </Link>
        </footer>
    );
};
export default Footer;
