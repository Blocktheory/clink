import Image from "next/image";

import { THandleStep } from "../../pages";
import { icons } from "../../utils/images";
import SecondaryBtn from "../SecondaryBtn";
import PrimaryBtn from "../PrimaryBtn";
import { useEffect, useState } from "react";
import OtpInput from "../OtpInput";

interface IConnectWallet extends THandleStep {
  signIn: (val: string) => Promise<void>;
  handleLensLogin: () => void;
  showOtp: boolean;
  loading: boolean;
  showMsg: boolean;
  loader?: boolean;
}

export default function ConnectWallet(props: IConnectWallet) {
  const { signIn, loader, handleLensLogin, showOtp, loading, showMsg } = props;
  const [value, setValue] = useState("");
  const [otp, setOtp] = useState("");
  const [enableVerifyBtn, setEnableVerifyBtn] = useState(false);

  const onChange = (val: string) => {
    console.log(val, "value");
    setOtp(val);
  };

  useEffect(() => {
    // This effect runs after each render when 'otp' changes.
    console.log(otp.length, "otp");

    // Check the length and set 'enableVerifyBtn' accordingly.
    if (otp.trim().length === 6) {
      console.log("came to if");
      setEnableVerifyBtn(true);
    } else {
      console.log("came to else");
      setEnableVerifyBtn(false);
    }
  }, [otp]);

  const handleInputChange = (val: string) => {
    setValue(val);
  };
  return (
    <>
      <div className="w-full relative lg:pt-10">
        <div className="w-full text-center p-2 relative">
          <div className="mb-[30px] lg:mb-5">
            <p className="text-sm md:text-lg font-bold leading-1 text-white/50 mb-6 md:mb-10">
              STEP 1
            </p>
            <p className="text-lg md:text-xl font-bold leading-1 text-white mb-3 md:mb-5 lg:mb-10">
              Connect your wallet
            </p>
            <p className="text-sm md:text-lg font-regular leading-1 md:leading-[32px] text-white/50 md:mb-10">
              Enable access to your wallet to load <br /> your assets to the
              chest
            </p>
          </div>
          <Image
            className="m-auto mb-[30px] lg:mb-5"
            src={icons.tchest}
            alt="Chest"
          />

          {/* <div className="flex gap-3 justify-center items-center w-[80%] md:w-[60%] lg:w-[360px] h-[64px] mx-auto rounded-lg mb-6 lg:mb-4">
                        <SecondaryBtn
                            leftImage={icons.walletIcon ?? ""}
                            title={connecting ? "Connecting..." : "Connect your wallet"}
                            onClick={connectWallet}
                        />
                    </div> */}

          {loader ? (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="spinnerLoader"></div>

              <p className=" mt-5 opacity-50 mb-14 text-[16px] leading-14 text-white">
                Setting up Smart Account!
              </p>
            </div>
          ) : (
            <>
              <div className="flex gap-3 justify-center items-center w-[80%] md:w-[60%] lg:w-[360px] mx-auto rounded-lg mt-10">
                <button
                  className={`py-4 w-full rounded-lg bg-white flex gap-2 items-center justify-center max-w-[400px]`}
                  onClick={handleLensLogin}
                >
                  <Image
                    src={icons.lensLogo}
                    alt="lens login"
                    className="w-6 rounded-full"
                  />
                  <span className="text-[16px] leading-1 font-medium text-black/50 self-center my-auto">
                    {"Sign in with Lens"}
                  </span>
                </button>
              </div>
              <div className="flex gap-3 justify-center items-center w-[80%] md:w-[60%] lg:w-[360px] mx-auto rounded-lg mt-10">
                <>
                  {showMsg ? (
                    <p>
                      Check your email We emailed a magic link and one-time PIN
                      to punith@blocktheory.com Please click the link to
                      continue.
                    </p>
                  ) : (
                    <div className="w-[80%]">
                      <input
                        name={"Enter email address"}
                        style={{
                          caretColor: "white",
                        }}
                        inputMode="text"
                        type="string"
                        className={`rounded-lg border border-gray-500 bg-white/5 p-2 cursor-pointer mb-5 pl-0 pt-2 pb-1 backdrop-blur-xl text-[14px] border-none text-center  text-white placeholder-white/40 block w-full focus:outline-none focus:ring-transparent`}
                        placeholder={"Enter email "}
                        value={value}
                        onChange={(e) => {
                          handleInputChange(`${e.target.value}`);
                        }}
                        onWheel={() =>
                          (document.activeElement as HTMLElement).blur()
                        }
                      />
                      <div className="my-4 cursor-pointer">
                        <PrimaryBtn
                          className={`lg:w-[90%] ${
                            value ? "opacity-100" : "opacity-40"
                          }`}
                          title={loading ? "Loading..." : "Signin"}
                          btnDisable={!value}
                          onClick={() => {
                            signIn(value);
                          }}
                        />
                      </div>
                    </div>
                  )}
                </>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
