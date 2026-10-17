import React from "react";

// Shared looks for the home page
export const buttonPrimary = "inline-flex items-center gap-2 rounded-xl bg-[var(--v2-accent-strong)] px-5 py-3 text-[15px] font-semibold text-white shadow-[0_8px_20px_-10px_var(--v2-accent-strong)] transition-[translate,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_14px_26px_-12px_var(--v2-accent-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--v2-accent)]";
export const buttonSecondary = "inline-flex items-center gap-2 rounded-xl border border-[#d3d9e0] bg-white px-5 py-3 text-[15px] font-semibold text-[var(--v2-ink)] transition-[translate,border-color] hover:-translate-y-0.5 hover:border-[var(--v2-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--v2-accent)]";
export const textLink = "font-semibold text-[var(--v2-accent)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--v2-accent)] rounded-sm";
export const eyebrowBase = "text-[13px] font-semibold uppercase tracking-[0.14em]";
export const eyebrow = `${eyebrowBase} text-[var(--v2-accent)]`;
export const chip = "inline-flex items-center gap-1.5 rounded-full border border-[var(--v2-line)] bg-white px-3 py-1.5 text-[13.5px] leading-none text-[var(--v2-body)]";

type IconProps = React.SVGProps<SVGSVGElement>;

const Icon: React.FC<IconProps & { children: React.ReactNode }> = ({ children, ...props }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    {children}
  </svg>
);

export const ArrowRight: React.FC<IconProps> = (p) => <Icon {...p}><path d="M5 12h14M13 6l6 6-6 6"/></Icon>;
export const ArrowUpRight: React.FC<IconProps> = (p) => <Icon {...p}><path d="M7 17 17 7M8 7h9v9"/></Icon>;
export const ChevronDown: React.FC<IconProps> = (p) => <Icon {...p}><path d="m6 9 6 6 6-6"/></Icon>;
export const MailIcon: React.FC<IconProps> = (p) => <Icon {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></Icon>;
export const FileIcon: React.FC<IconProps> = (p) => <Icon {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></Icon>;

export const LinkedInIcon: React.FC<IconProps> = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/>
  </svg>
);

export const GitHubIcon: React.FC<IconProps> = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22l-.01 3.29c0 .31.2.69.82.57A12 12 0 0 0 12 .3"/>
  </svg>
);
