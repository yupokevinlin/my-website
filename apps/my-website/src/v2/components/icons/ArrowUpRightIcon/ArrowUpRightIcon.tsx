import type { ReactNode } from "react";
import { Icon, IconProps } from "../Icon/Icon";

// For links that open another site
export const ArrowUpRightIcon = (props: IconProps): ReactNode => (
  <Icon {...props}><path d="M7 17 17 7M8 7h9v9"/></Icon>
);
