import type { ReactNode } from "react";
import { Icon, IconProps } from "../Icon/Icon";

export const ArrowRightIcon = (props: IconProps): ReactNode => (
  <Icon {...props}><path d="M5 12h14M13 6l6 6-6 6"/></Icon>
);
