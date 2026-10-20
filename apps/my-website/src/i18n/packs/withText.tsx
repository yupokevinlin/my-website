import type { NextPage } from "next";
import type { ComponentType, ReactNode } from "react";

export type TextPackComponent = ComponentType<{ children: ReactNode }>;

// A page with its text around it. The page's file imports its pack, so the
// text is part of the page's own JavaScript and is there when the page
// hydrates: English pages carry only English, and pages/[locale]/... carry the
// other four languages (never both kinds of page, home and guide).
export const withText = (Page: ComponentType, Text: TextPackComponent): NextPage => {
  const PageWithText: NextPage = () => (
    <Text>
      <Page/>
    </Text>
  );
  return PageWithText;
};
