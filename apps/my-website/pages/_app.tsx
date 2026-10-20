import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Roboto } from "next/font/google";
import { useEffect } from "react";
import { LocaleProvider } from "../src/i18n/LocaleContext";
import { toLocale } from "../src/i18n/locales";

// /v1 and the ray-tracing guide use Roboto; the home page uses Inter. Not
// preloaded, so the home page never downloads it.
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-roboto",
  preload: false,
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  // Analytics loads after the page has, so it never competes with it
  useEffect(() => {
    const start = () => void import("../src/firebase/firebase").then(({ initAnalytics }) => initAnalytics());
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);

  return (
    // Pages under pages/[locale]/ pass their language as a prop; the rest are English
    <LocaleProvider locale={toLocale(pageProps.locale)}>
      <div className={roboto.variable} style={{ display: "contents" }}>
        <Component {...pageProps} />
      </div>
    </LocaleProvider>
  );
};

export default MyApp;
