import { type ReactNode, useState } from "react";
import clsx from "clsx";
import type { Role } from "../../../../../data/experience";
import { useLocale, useMessages } from "../../../../../i18n/LocaleContext";
import { roleSpan } from "../../dates";
import { Collapse } from "../../../Collapse/Collapse";
import { ChevronDownIcon } from "../../../icons/ChevronDownIcon/ChevronDownIcon";
import { Bullets } from "./Bullets/Bullets";

export interface RoleBlockProps {
  role: Role;
  // For the folded bullets' region
  id: string;
}

// One role: title, dates, the strongest results, and the rest behind "Show more".
// A current role shows all of its results.
export const RoleBlock = ({ role, id }: RoleBlockProps): ReactNode => {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const messages = useMessages();
  const { range, duration } = roleSpan(role, locale, messages);
  const current = role.end === "Present";
  return (
    <div>
      <h4 className="text-[17px] font-semibold leading-snug text-[var(--v2-ink)]">{role.title}</h4>
      <p className="mt-0.5 text-[14px] text-[var(--v2-muted)]">{range} · {duration} · {role.location}</p>
      <Bullets items={current ? [...role.highlights, ...(role.more ?? [])] : role.highlights} className="mt-3"/>
      {!current && role.more?.length ? (
        <>
          <Collapse id={id} open={open}><Bullets items={role.more} className="pt-2.5"/></Collapse>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={id}
            onClick={() => setOpen((value) => !value)}
            className="mt-3 inline-flex cursor-pointer items-center gap-1 rounded-md text-[14px] font-semibold text-[var(--v2-accent)] hover:underline"
          >
            {open ? messages.home.experience.showLess : messages.home.experience.showMore(role.more.length)}
            <ChevronDownIcon width={16} height={16} className={clsx("transition-transform duration-300", open && "rotate-180")}/>
          </button>
        </>
      ) : null}
    </div>
  );
};
