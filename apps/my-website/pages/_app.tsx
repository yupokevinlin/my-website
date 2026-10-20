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
  // Analytics (Google's gtag.js, the heaviest script on the page) starts once
  // the page has loaded and the visitor has scrolled, tapped or typed, or
  // after 5 seconds, and then only when the browser is idle, so it never
  // competes with the page starting up. A visit that ends sooner, without
  // any of those, isn't counted.
  useEffect(() => {
    const EVENTS = ["pointerdown", "keydown", "scroll", "wheel", "touchstart"] as const;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      clearTimeout(timer);
      for (const name of EVENTS) window.removeEventListener(name, start);
      const run = () => void import("../src/firebase/firebase").then(({ initAnalytics }) => initAnalytics());
      if ("requestIdleCallback" in window) window.requestIdleCallback(run, { timeout: 3000 });
      else setTimeout(run, 0);
    };
    const wait = () => {
      timer = setTimeout(start, 5000);
      for (const name of EVENTS) window.addEventListener(name, start, { once: true, passive: true });
    };
    if (document.readyState === "complete") wait();
    else window.addEventListener("load", wait, { once: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", wait);
      for (const name of EVENTS) window.removeEventListener(name, start);
    };
  }, []);

  return (
    // Pages under pages/[locale]/ pass their language as a prop; the rest are
    // English. Each page brings its own text (src/i18n/packs/withText.tsx).
    <LocaleProvider locale={toLocale(pageProps.locale)}>
      <div className={roboto.variable} style={{ display: "contents" }}>
        <Component {...pageProps} />
      </div>
    </LocaleProvider>
  );
};

export default MyApp;
