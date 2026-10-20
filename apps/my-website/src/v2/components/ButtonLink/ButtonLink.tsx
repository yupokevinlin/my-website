import type { ReactNode } from "react";
import clsx from "clsx";
import { useLocaleHref } from "../../hooks/useHomeContent";

export interface ButtonLinkProps {
  href: string;
  variant?: "primary" | "secondary" | "text";
  // Kevin's own profiles get rel="me"
  me?: boolean;
  className?: string;
  children: ReactNode;
}

const VARIANTS = {
  primary: "rounded-xl bg-[var(--v2-accent-strong)] px-5 py-3 text-white shadow-[0_8px_20px_-10px_var(--v2-accent-strong)] transition-[translate,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_14px_26px_-12px_var(--v2-accent-strong)]",
  secondary: "rounded-xl border border-[var(--v2-line)] bg-white px-5 py-3 text-[var(--v2-ink)] transition-[translate,border-color] hover:-translate-y-0.5 hover:border-[var(--v2-accent)]",
  // The darker accent, so it reads on the frosted cards over the scene too
  text: "rounded-sm px-1 py-3 text-[var(--v2-accent-strong)] underline-offset-4 hover:underline",
};

// A link that looks like a button. Other sites and the resume PDF open in a
// new tab; links within the page don't. Site pages that exist in every
// language (the guide) link to the page's language.
export const ButtonLink = ({ href, variant = "primary", me, className, children }: ButtonLinkProps): ReactNode => {
  const newTab = /^https?:/.test(href) || href.endsWith(".pdf");
  const localeHref = useLocaleHref();
  return (
    <a
      href={localeHref(href)}
      {...(newTab ? { target: "_blank", rel: me ? "me noopener" : "noopener" } : {})}
      className={clsx("inline-flex items-center gap-1.5 text-[15px] font-semibold", VARIANTS[variant], className)}
    >
      {children}
    </a>
  );
};
