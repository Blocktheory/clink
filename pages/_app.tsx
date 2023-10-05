import "./globals.css";

import type { AppProps } from "next/app";
import React, { FC } from "react";

import GlobalContextProvider from "../context/GlobalContext";
import { WagmiWrapper } from "../utils/wagmi/WagmiContext";
import { bindings as wagmiBindings } from "@lens-protocol/wagmi";
import {
  LensProvider,
  LensConfig,
  development,
  production,
} from "@lens-protocol/react-web";

const Layout: FC<AppProps> = ({ Component, pageProps }) => {
  const lensConfig: LensConfig = {
    bindings: wagmiBindings(),
    environment: production,
  };
  return (
    <main>
      <GlobalContextProvider>
        <WagmiWrapper>
          <LensProvider config={lensConfig}>
            <Component {...pageProps} />
          </LensProvider>
        </WagmiWrapper>
      </GlobalContextProvider>
    </main>
  );
};

export default Layout;
