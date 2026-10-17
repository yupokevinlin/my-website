import React, { ReactElement } from "react";
import { Divider, Typography, Paper, Dialog, ButtonBase } from "@/components";
import { ScrollNavigationDrawerMenuItemData, ScrollNavigationDrawerMenuItemName } from "./ScrollNavigationDrawerMenuItem/types";
import ScrollNavigationDrawerMenuItem from "./ScrollNavigationDrawerMenuItem/ScrollNavigationDrawerMenuItem";
import { MaterialIconNames } from "../../MaterialIcon/MaterialIcon";
import ScrollNavigationDrawerSeasonSwitch from "./ScrollNavigationDrawerSeasonSwitch/ScrollNavigationDrawerSeasonSwitch";
import { ThemePictureSeason } from "../../ThemePicture/types";

export interface ScrollNavigationDrawerProps {
  drawerOpen: boolean;
  menuItems: Array<ScrollNavigationDrawerMenuItemData>;
  isTopSelected: boolean;
  season: ThemePictureSeason;
  handleItemClick(name: ScrollNavigationDrawerMenuItemName): void;
  handleDialogClose(): void;
  handleSeasonChange(season: ThemePictureSeason): void;
}

const ScrollNavigationDrawer: React.FC<ScrollNavigationDrawerProps> = (props) => {
  const { drawerOpen, menuItems, isTopSelected, season, handleItemClick, handleDialogClose, handleSeasonChange } = props;

  const handleMenuItemClick = (name: ScrollNavigationDrawerMenuItemName): void => {
    handleItemClick(name);
  };

  const handleHeaderClick = (): void => {
    handleItemClick(ScrollNavigationDrawerMenuItemName.PICTURE);
  };

  // listWrapper heights per breakpoint
  const listWrapperClass = "flex flex-col w-full h-[297px] min-h-[297px] sm:h-[351px] sm:min-h-[351px] md:h-[383px] md:min-h-[383px] lg:h-[423px] lg:min-h-[423px]";

  const renderList = (compact: boolean): ReactElement => (
    <Paper
      className="flex flex-col items-start justify-between h-screen w-[128px] sm:w-[160px] md:h-full md:w-[172px] lg:w-[192px]"
      style={{ maxHeight: "-webkit-fill-available", minHeight: compact ? "-webkit-fill-available" : undefined }}
      square
    >
      <div className={listWrapperClass}>
        {compact ? (
          <ScrollNavigationDrawerMenuItem
            data={{ name: ScrollNavigationDrawerMenuItemName.PICTURE, icon: MaterialIconNames.ArrowUpward, color: "#666666", active: isTopSelected }}
            key={ScrollNavigationDrawerMenuItemName.PICTURE}
            handleMenuItemClick={handleMenuItemClick}
          />
        ) : (
          <React.Fragment>
            <ButtonBase
              className="w-full flex flex-col items-center justify-center md:h-[70px] lg:h-[78px] focus-visible:[outline-offset:-0.125rem]"
              onClick={handleHeaderClick}
            >
              <Typography
                className="!select-none !font-light md:!text-[30px] md:!leading-[30px] md:!h-[30px] md:!mb-[7px] lg:!text-[34px] lg:!leading-[34px] lg:!h-[34px] lg:!mb-[8px]"
                style={{ color: "var(--primary-main)" }}
              >
                Kevin Lin
              </Typography>
              <Typography
                className="!select-none !font-normal md:!text-[15px] md:!leading-[15px] md:!h-[15px] lg:!text-[17px] lg:!leading-[17px] lg:!h-[17px]"
                style={{ color: "var(--secondary-main)" }}
              >
                Full Stack Developer
              </Typography>
            </ButtonBase>
            <Divider/>
          </React.Fragment>
        )}
        {menuItems.map((menuItem) => (
          <ScrollNavigationDrawerMenuItem data={menuItem} key={menuItem.name} handleMenuItemClick={handleMenuItemClick}/>
        ))}
      </div>
      <ScrollNavigationDrawerSeasonSwitch season={season} handleSeasonChange={handleSeasonChange}/>
    </Paper>
  );

  return (
    <React.Fragment>
      {/* Mobile (< md): slide-out overlay. As a portal/overlay it adds no layout
          flow, and on desktop it stays closed (the trigger is hidden via CSS). */}
      <Dialog
        classes={{
          container: "!flex !flex-row !items-center !justify-start !h-auto !w-full",
          paper: "!h-screen !max-h-[-webkit-fill-available] !min-h-[-webkit-fill-available] !m-0 !rounded-none !w-max",
        }}
        open={drawerOpen}
        onClose={handleDialogClose}
      >
        {renderList(true)}
      </Dialog>
      {/* Desktop (>= md): permanent in-flow drawer. Rendered for every viewport
          but only shown at md+, so the layout is correct at first paint with no
          JS-driven breakpoint swap (avoids CLS). */}
      <div className="hidden md:block h-full">
        {renderList(false)}
      </div>
    </React.Fragment>
  );
};

export default ScrollNavigationDrawer;
