import type { ReactNode } from "react";
import { Icon, IconProps } from "../Icon/Icon";

// Solid, for the section badges. The tighter viewBox draws it a little
// bigger, to match the weight of the other badge icons.
export const UserIcon = (props: IconProps): ReactNode => (
  <Icon fill="currentColor" stroke="none" viewBox="2.5 2.5 19 19" {...props}><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></Icon>
);
