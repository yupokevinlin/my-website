import type { ReactNode } from "react";
import { Icon, IconProps } from "../Icon/Icon";

export const ChevronDownIcon = (props: IconProps): ReactNode => (
  <Icon {...props}><path d="m6 9 6 6 6-6"/></Icon>
);
