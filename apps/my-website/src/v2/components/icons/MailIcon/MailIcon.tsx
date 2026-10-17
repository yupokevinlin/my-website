import type { ReactNode } from "react";
import { Icon, IconProps } from "../Icon/Icon";

export const MailIcon = (props: IconProps): ReactNode => (
  <Icon {...props}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></Icon>
);
