import React, { useRef, useState } from "react";
import { Divider, Menu, ButtonBase, Typography } from "@/components";
import { ThemePictureSeason } from "../../../ThemePicture/types";
import ScrollNavigationDrawerSeasonSwitchMenuItem from "./ScrollNavigationDrawerSeasonSwitchMenuItem/ScrollNavigationDrawerSeasonSwitchMenuItem";
import MaterialIcon, { MaterialIconNames } from "../../../MaterialIcon/MaterialIcon";

export interface ScrollNavigationDrawerSeasonSwitchProps {
  season: ThemePictureSeason;
  handleSeasonChange(season: ThemePictureSeason): void;
}

const SEASONS = [
  ThemePictureSeason.SPRING,
  ThemePictureSeason.SUMMER,
  ThemePictureSeason.AUTUMN,
  ThemePictureSeason.WINTER,
] as const;

const ScrollNavigationDrawerSeasonSwitch: React.FC<ScrollNavigationDrawerSeasonSwitchProps> = ({ season, handleSeasonChange }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([null, null, null, null]);

  const openMenu = (focusLast = false): void => {
    setMenuOpen(true);
    requestAnimationFrame(() => {
      const items = itemRefs.current.filter(Boolean) as HTMLButtonElement[];
      (focusLast ? items[items.length - 1] : items[0])?.focus();
    });
  };

  const closeMenu = (returnFocus = true): void => {
    setMenuOpen(false);
    if (returnFocus) requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const handleMenuItemClick = (newSeason: ThemePictureSeason): void => {
    if (newSeason !== season) handleSeasonChange(newSeason);
    closeMenu(true);
  };

  // Trigger button keyboard handling (W3C menu button pattern)
  const handleTriggerKeyDown = (e: React.KeyboardEvent): void => {
    switch (e.key) {
      case "Enter":
      case " ":
      case "ArrowDown":
        e.preventDefault();
        openMenu(false);
        break;
      case "ArrowUp":
        e.preventDefault();
        openMenu(true);
        break;
    }
  };

  // Menu keyboard handling
  const handleMenuKeyDown = (e: React.KeyboardEvent): void => {
    const items = itemRefs.current.filter(Boolean) as HTMLButtonElement[];
    const currentIndex = items.indexOf(document.activeElement as HTMLButtonElement);

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        items[(currentIndex + 1) % items.length]?.focus();
        break;
      case "ArrowUp":
        e.preventDefault();
        items[(currentIndex - 1 + items.length) % items.length]?.focus();
        break;
      case "Home":
        e.preventDefault();
        items[0]?.focus();
        break;
      case "End":
        e.preventDefault();
        items[items.length - 1]?.focus();
        break;
      case "Escape":
        e.preventDefault();
        closeMenu(true);
        break;
      case "Tab":
        closeMenu(false);
        break;
    }
  };

  const iconWrapperClass = "flex items-center justify-center rounded-full h-[19px] w-[19px] ml-[18px] sm:h-[27px] sm:w-[27px] sm:ml-[25px] lg:h-[30px] lg:w-[30px] lg:ml-[28px]";
  const iconClass = "!h-[14px] !w-[14px] sm:!h-[20px] sm:!w-[20px] lg:!h-[22px] lg:!w-[22px]";

  const renderTriggerContent = (): React.ReactElement => {
    const textEl = (
      <Typography
        className="!font-light !text-[13px] !ml-[13px] sm:!text-[15px] sm:!ml-[15px] lg:!text-[17px] lg:!ml-[17px]"
        style={{ color: "var(--secondary-main)" }}
      >
        Theme
      </Typography>
    );
    switch (season) {
      case ThemePictureSeason.SPRING:
        return (<><div className={iconWrapperClass} style={{ backgroundColor: "#569935" }}><MaterialIcon iconName={MaterialIconNames.Flower} className={iconClass} style={{ color: "#ffffff" }}/></div>{textEl}</>);
      case ThemePictureSeason.SUMMER:
        return (<><div className={iconWrapperClass} style={{ backgroundColor: "#17325e" }}><MaterialIcon iconName={MaterialIconNames.Brightness3} className={iconClass} style={{ color: "#b9c4d8", transform: "rotate(30deg)" }}/></div>{textEl}</>);
      case ThemePictureSeason.AUTUMN:
        return (<><div className={iconWrapperClass} style={{ backgroundColor: "#e97325" }}><MaterialIcon iconName={MaterialIconNames.Eco} className={iconClass} style={{ color: "#f9d44e" }}/></div>{textEl}</>);
      case ThemePictureSeason.WINTER:
        return (<><div className={iconWrapperClass} style={{ backgroundColor: "#4e8ec7" }}><MaterialIcon iconName={MaterialIconNames.Snowflake} className={iconClass} style={{ color: "#ffffff" }}/></div>{textEl}</>);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-start w-full h-[32px] sm:h-[38px] lg:h-[42px]"
      style={{ backgroundColor: "var(--bg-paper)" }}
    >
      <Divider className="!w-full"/>
      <ButtonBase
        ref={triggerRef}
        id="season-menu-btn"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-controls={menuOpen ? "season-menu" : undefined}
        className="flex flex-row items-center justify-start h-[calc(100%-1px)] w-full transition-[filter] duration-200 hover:brightness-90 focus-visible:[outline-offset:-0.125rem]"
        style={{ backgroundColor: "var(--bg-paper)" }}
        onClick={() => menuOpen ? closeMenu() : openMenu()}
        onKeyDown={handleTriggerKeyDown}
      >
        {renderTriggerContent()}
      </ButtonBase>

      <Menu
        id="season-menu"
        labelledBy="season-menu-btn"
        anchorEl={triggerRef.current}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={menuOpen}
        onClick={() => closeMenu(true)}
        onKeyDown={handleMenuKeyDown}
      >
        <Divider/>
        {SEASONS.map((s, i) => (
          <React.Fragment key={s}>
            <ScrollNavigationDrawerSeasonSwitchMenuItem
              ref={(el) => { itemRefs.current[i] = el; }}
              season={s}
              handleSeasonChange={handleMenuItemClick}
            />
            <Divider/>
          </React.Fragment>
        ))}
      </Menu>
    </div>
  );
};

export default ScrollNavigationDrawerSeasonSwitch;
