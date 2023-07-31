import "./globals.css";

import type { AppProps } from "next/app";
import React, { FC } from "react";
import GlobalContextProvider from "../context/GlobalContext";

const Layout: FC<AppProps> = ({ Component, pageProps }) => {
    return (
        <main>
            <GlobalContextProvider>
                <Component {...pageProps} />
            </GlobalContextProvider>
        </main>
    );
};

export default Layout;
