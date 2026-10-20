import type { ReactNode } from "react";
import { Icon, IconProps } from "../Icon/Icon";

// Solid, for the section badges
export const CodeIcon = (props: IconProps): ReactNode => (
  <Icon fill="currentColor" stroke="none" {...props}><path d="M9.4 16.6 4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0 4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></Icon>
);
