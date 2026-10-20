import { Inter } from "next/font/google";

// One typeface for the whole home page: the name, headings and body text all
// use Inter, so nothing looks borrowed from another site.
export const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-v2-sans",
});
