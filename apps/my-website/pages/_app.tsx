import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-roboto",
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <div className={roboto.variable} style={{ display: "contents" }}>
      <Component {...pageProps} />
    </div>
  );
};

export default MyApp;
