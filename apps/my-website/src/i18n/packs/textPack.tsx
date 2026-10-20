import type { ReactNode } from "react";
import { type TextPack, TextProvider } from "../LocaleContext";

// A page's text in one language, as a component that provides it to the page
// inside (see withText.tsx)
export const textPack = (pack: TextPack) => {
  const Pack = ({ children }: { children: ReactNode }): ReactNode => <TextProvider pack={pack}>{children}</TextProvider>;
  return Pack;
};
