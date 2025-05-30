import "../styles/main.scss";
import React, { useState, useEffect, ReactNode, ReactElement } from "react";
import { Provider } from "react-redux";
import { LanguageProvider } from "../localization/LocalContext";
import Head from "next/head";
import type { AppProps } from "next/app";
import { store } from "../app/store";
import DashboardLayout from "@/components/dashboard-layout/dashboard-layout";
import { useRouter } from "next/router";
import GlobalLoader from "@/components/global-loader/global-loader";
import LayoutSelector from "@/components/dashboard-layout/dashboard-selector";
import AuthMiddleware from "@/components/auth-middleware/auth-middleware";

type NextPageWithLayout = AppProps["Component"] & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url: string) =>
      url !== router.asPath && setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  // Check for custom getLayout function on the page component
  const ComponentWithLayout = Component as NextPageWithLayout;
  const getLayout = ComponentWithLayout.getLayout ?? ((page) => <>{page}</>);

  return (
    <Provider store={store}>
      <LanguageProvider>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta name="csrf-token" content="your-csrf-token-here" />
        </Head>
        <GlobalLoader isLoading={loading} />
        <AuthMiddleware>
          <LayoutSelector>
            {getLayout(<Component {...pageProps} />)}
          </LayoutSelector>
        </AuthMiddleware>
      </LanguageProvider>
    </Provider>
  );
}
