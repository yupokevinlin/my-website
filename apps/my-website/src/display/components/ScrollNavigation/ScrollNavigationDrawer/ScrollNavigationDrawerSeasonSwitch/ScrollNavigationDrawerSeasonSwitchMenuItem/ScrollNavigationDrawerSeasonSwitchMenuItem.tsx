import React from "react";
import { ButtonBase, Typography } from "@/components";
import { ThemePictureSeason } from "../../../../ThemePicture/types";
import MaterialIcon, { MaterialIconNames } from "../../../../MaterialIcon/MaterialIcon";

export interface ScrollNavigationDrawerSeasonSwitchMenuItemProps {
  season: ThemePictureSeason;
  handleSeasonChange(season: ThemePictureSeason): void;
}

const ScrollNavigationDrawerSeasonSwitchMenuItem = React.forwardRef<
  HTMLButtonElement,
  ScrollNavigationDrawerSeasonSwitchMenuItemProps
>(({ season, handleSeasonChange }, ref) => {
  const iconWrapperClass = "flex items-center justify-center rounded-full h-[18px] w-[18px] ml-[14px] sm:h-[22px] sm:w-[22px] sm:ml-[18px] lg:h-[24px] lg:w-[24px] lg:ml-[22px]";
  const iconClass = "!h-[12px] !w-[12px] sm:!h-[16px] sm:!w-[16px] lg:!h-[18px] lg:!w-[18px]";
  const textClass = "!font-light !text-[12px] !ml-[7px] !mr-[14px] sm:!text-[14px] sm:!ml-[9px] sm:!mr-[18px] lg:!text-[17px] lg:!ml-[11px] lg:!mr-[22px]";

  const renderContent = () => {
    switch (season) {
      case ThemePictureSeason.SPRING:
        return (<>
          <div className={iconWrapperClass} style={{ backgroundColor: "#569935" }}>
            <MaterialIcon iconName={MaterialIconNames.Flower} className={iconClass} style={{ color: "#ffffff" }}/>
          </div>
          <Typography className={textClass} style={{ color: "var(--secondary-main)" }}>Spring Theme</Typography>
        </>);
      case ThemePictureSeason.SUMMER:
        return (<>
          <div className={iconWrapperClass} style={{ backgroundColor: "#17325e" }}>
            <MaterialIcon iconName={MaterialIconNames.Brightness3} className={iconClass} style={{ color: "#b9c4d8", transform: "rotate(30deg)" }}/>
          </div>
          <Typography className={textClass} style={{ color: "var(--secondary-main)" }}>Summer Theme</Typography>
        </>);
      case ThemePictureSeason.AUTUMN:
        return (<>
          <div className={iconWrapperClass} style={{ backgroundColor: "#e97325" }}>
            <MaterialIcon iconName={MaterialIconNames.Eco} className={iconClass} style={{ color: "#f9d44e" }}/>
          </div>
          <Typography className={textClass} style={{ color: "var(--secondary-main)" }}>Autumn Theme</Typography>
        </>);
      case ThemePictureSeason.WINTER:
        return (<>
          <div className={iconWrapperClass} style={{ backgroundColor: "#4e8ec7" }}>
            <MaterialIcon iconName={MaterialIconNames.Snowflake} className={iconClass} style={{ color: "#ffffff" }}/>
          </div>
          <Typography className={textClass} style={{ color: "var(--secondary-main)" }}>Winter Theme</Typography>
        </>);
    }
  };

  return (
    <ButtonBase
      ref={ref}
      role="menuitem"
      className="cursor-pointer select-none flex flex-row items-center !justify-start h-[22px] w-[138px] sm:h-[28px] sm:w-[166px] lg:h-[32px] lg:w-[207px] focus-visible:[outline-offset:-0.125rem]"
      style={{ backgroundColor: "var(--bg-paper)" }}
      onClick={() => handleSeasonChange(season)}
    >
      {renderContent()}
    </ButtonBase>
  );
});

ScrollNavigationDrawerSeasonSwitchMenuItem.displayName = "ScrollNavigationDrawerSeasonSwitchMenuItem";

export default ScrollNavigationDrawerSeasonSwitchMenuItem;
