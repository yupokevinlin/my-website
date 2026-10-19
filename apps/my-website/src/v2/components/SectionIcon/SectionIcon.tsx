import type { ComponentType, ReactNode } from "react";
import type { IconProps } from "../icons/Icon/Icon";

export interface SectionIconProps {
  // The line icon that stands for the section
  glyph: ComponentType<IconProps>;
  size?: number;
}

// A section's icon in the style of the season icons: the glyph on a round
// badge in the season's colours (--v2-icon-bg, --v2-icon-fg)
export const SectionIcon = ({ glyph: Glyph, size = 28 }: SectionIconProps): ReactNode => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" className="shrink-0">
    <circle cx="12" cy="12" r="12" style={{ fill: "var(--v2-icon-bg, var(--v2-bright))" }}/>
    <Glyph x="5" y="5" width="14" height="14" style={{ color: "var(--v2-icon-fg, #ffffff)" }}/>
  </svg>
);
