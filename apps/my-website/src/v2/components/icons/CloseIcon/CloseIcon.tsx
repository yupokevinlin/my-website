import type { ReactNode } from "react";
import { Icon, IconProps } from "../Icon/Icon";

export const CloseIcon = (props: IconProps): ReactNode => (
  <Icon {...props}><path d="M6 6l12 12M18 6L6 18"/></Icon>
);
