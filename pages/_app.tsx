import "./globals.css";

import type { AppProps } from "next/app";
import React, { FC } from "react";

const Layout: FC<AppProps> = ({ Component, pageProps }) => {
    return (
        <main>
            <Component {...pageProps} />
        </main>
    );
};

export default Layout;
