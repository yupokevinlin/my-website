import React from "react";
import { NOW } from "../time";
import { profile } from "../../data/profile";

const Footer: React.FC = () => (
  <footer className="border-t border-[var(--v2-line)]">
    <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-4 py-8 text-[14px] text-[var(--v2-muted)] sm:flex-row sm:items-center sm:justify-between md:px-8">
      <p>
        © {NOW.year} {profile.name} ·{" "}
        <a href="/v1" className="underline underline-offset-4 hover:text-[var(--v2-accent)]">Previous version</a>
      </p>
      <p>Built with Next.js. The illustration follows Vancouver's seasons.</p>
    </div>
  </footer>
);

export default Footer;
