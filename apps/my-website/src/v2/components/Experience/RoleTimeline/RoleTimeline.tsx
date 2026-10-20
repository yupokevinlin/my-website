import type { ReactNode } from "react";
import clsx from "clsx";
import type { Role } from "../../../../data/experience";
import { RoleBlock } from "./RoleBlock/RoleBlock";

export interface RoleTimelineProps {
  roles: Role[];
  // Prefix for each role's folded-bullets id
  idPrefix: string;
}

// A company's roles, newest first, joined by a line as on LinkedIn. A current
// role's dot is filled.
export const RoleTimeline = ({ roles, idPrefix }: RoleTimelineProps): ReactNode => (
  <ol className="mt-6">
    {roles.map((role, i) => {
      const last = i === roles.length - 1;
      return (
        <li key={role.title} className="grid grid-cols-[0.875rem_1fr] gap-x-4 md:gap-x-5">
          <div aria-hidden="true" className="flex flex-col items-center pt-[0.4rem]">
            <span className={clsx("h-3.5 w-3.5 shrink-0 rounded-full border-[3px] border-[var(--v2-bright)]", role.end === "Present" ? "bg-[var(--v2-bright)]" : "bg-white")}/>
            {!last ? <span className="mt-1.5 w-0.5 flex-1 rounded-full bg-[var(--v2-line)]"/> : null}
          </div>
          <div className={clsx("min-w-0", !last && "pb-8")}>
            <RoleBlock role={role} id={`${idPrefix}-${i}`}/>
          </div>
        </li>
      );
    })}
  </ol>
);
