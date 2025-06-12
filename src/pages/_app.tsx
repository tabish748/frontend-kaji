import "../styles/main.scss";
import React, { useState, useEffect, ReactNode, ReactElement } from "react";
import { Provider, useSelector } from "react-redux";
import { LanguageProvider } from "../localization/LocalContext";
import Head from "next/head";
import type { AppProps } from "next/app";
import { store, RootState } from "../app/store";
import { useRouter } from "next/router";
import GlobalLoader from "@/components/global-loader/global-loader";
import LayoutSelector from "@/components/dashboard-layout/dashboard-selector";
import AuthMiddleware from "@/components/auth-middleware/auth-middleware";

type NextPageWithLayout = AppProps["Component"] & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface AppContentProps {
  Component: AppProps["Component"];
  pageProps: AppProps["pageProps"];
}

function AppContent({ Component, pageProps }: AppContentProps) {
  const router = useRouter();
  const [routeLoading, setRouteLoading] = useState(false);
  const apiLoading = useSelector((state: RootState) => state.loading.isLoading);

  useEffect(() => {
    const handleStart = (url: string) =>
      url !== router.asPath && setRouteLoading(true);
    const handleComplete = () => setRouteLoading(false);

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

  // Combine both loading states
  const isLoading = routeLoading || apiLoading;

  return (
    <LanguageProvider>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <meta name="csrf-token" content="your-csrf-token-here" />
      </Head>
      <GlobalLoader isLoading={isLoading} />
      <AuthMiddleware>
        <LayoutSelector>
          {getLayout(<Component {...pageProps} />)}
        </LayoutSelector>
      </AuthMiddleware>
    </LanguageProvider>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <AppContent Component={Component} pageProps={pageProps} />
    </Provider>
  );
}
