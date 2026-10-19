import type { ReactNode } from "react";
import { NOW } from "../../time";
import { profile } from "../../../data/profile";

// In the season's deepest colour, under the landscape
export const Footer = (): ReactNode => (
  <footer className="bg-[var(--v2-deep)] text-white/80">
    <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-4 py-8 text-[14px] sm:flex-row sm:items-center sm:justify-between md:px-8">
      <p>
        © {NOW.year} {profile.name} ·{" "}
        <a href="/v1" className="rounded-sm text-white underline underline-offset-4 hover:no-underline">Previous version</a>
      </p>
      <p>The illustration follows Vancouver's seasons.</p>
    </div>
  </footer>
);
