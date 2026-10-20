import type { ReactNode } from "react";
import { ArrowUpRightIcon } from "../../icons/ArrowUpRightIcon/ArrowUpRightIcon";

export interface ContactMethodProps {
  label: string;
  detail: string;
  href: string;
  icon: ReactNode;
  // Kevin's own profiles get rel="me"
  me?: boolean;
}

// One way to reach Kevin, as a card that opens in a new tab
export const ContactMethod = ({ label, detail, href, icon, me }: ContactMethodProps): ReactNode => (
  <a
    href={href}
    target="_blank"
    rel={me ? "me noopener" : "noopener"}
    className="group flex h-full items-center gap-3 rounded-2xl border border-white bg-white/85 p-4 text-left transition-[translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-28px_var(--v2-deep)]"
  >
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--v2-tint)] text-[var(--v2-accent-strong)]">{icon}</span>
    <div className="min-w-0 flex-1">
      <h3 className="text-[15.5px] font-semibold text-[var(--v2-ink)]">{label}</h3>
      <p className="truncate text-[13px] text-[var(--v2-muted)]">{detail}</p>
    </div>
    <ArrowUpRightIcon width={16} height={16} className="shrink-0 text-[var(--v2-muted)] group-hover:text-[var(--v2-accent)]"/>
  </a>
);
