import type { ReactNode } from "react";
import { NOW } from "../../time";
import { profile } from "../../../data/profile";
import { useMessages } from "../../../i18n/LocaleContext";

// In the season's deepest colour, under the landscape
export const Footer = (): ReactNode => {
  const text = useMessages().home.footer;
  return (
    <footer className="bg-[var(--v2-deep)] text-white/80">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-4 py-8 text-[14px] sm:flex-row sm:items-center sm:justify-between md:px-8">
        <p>
          © {NOW.year} {profile.name} ·{" "}
          <a href="/v1" className="rounded-sm text-white underline underline-offset-4 hover:no-underline">{text.previousVersion}</a>
        </p>
        <p>{text.seasonsNote}</p>
      </div>
    </footer>
  );
};
