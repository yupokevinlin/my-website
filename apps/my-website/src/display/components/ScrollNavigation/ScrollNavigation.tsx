import React, { ReactElement, useEffect, useRef, useState } from "react";
import Scrollbars from "@/components/Scrollbars";
import ScrollNavigationDrawer from "./ScrollNavigationDrawer/ScrollNavigationDrawer";

import { ScrollNavigationDrawerMenuItemData, ScrollNavigationDrawerMenuItemName } from "./ScrollNavigationDrawer/ScrollNavigationDrawerMenuItem/types";
import Section from "../Section/Section";
import TopBar from "../TopBar/TopBar";
import { ThemePictureSeason } from "../ThemePicture/types";

export interface ScrollNavigationProps {
  menuItems: Array<ScrollNavigationDrawerMenuItemData>;
  isTopSelected: boolean;
  season: ThemePictureSeason;
  children?: React.ReactNode;
  handleItemClick(name: ScrollNavigationDrawerMenuItemName, wrapperElement: Element): void;
  handleScroll(name: ScrollNavigationDrawerMenuItemName): void;
  handleSeasonChange(season: ThemePictureSeason): void;
}

const ScrollNavigation: React.FC<ScrollNavigationProps> = (props) => {
  const { menuItems, isTopSelected, season, handleItemClick, handleScroll, handleSeasonChange } = props;
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const handleDrawerOpen = (): void => { setDrawerOpen(true); };
  const handleDrawerClose = (): void => { setDrawerOpen(false); };

  const handleScrollObserverIntersect = (entries: Array<IntersectionObserverEntry>): void => {
    const intersectingEntry = entries.find(entry => entry.isIntersecting);
    if (intersectingEntry) {
      handleScroll(intersectingEntry.target.id as ScrollNavigationDrawerMenuItemName);
    }
  };

  const contentRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const [scrollObserver, setScrollObserver] = useState<IntersectionObserver | null>(null);

  useEffect(() => {
    if (contentRef.current) {
      const newScrollObserver = new IntersectionObserver(handleScrollObserverIntersect, {
        root: contentRef.current,
        threshold: 0,
        rootMargin: "-50% 0px",
      });
      setScrollObserver(newScrollObserver);
    }
  }, []);

  const renderChildren = (): ReactElement => {
    const children: Array<any> = props.children as Array<any>;
    return (
      <React.Fragment>
        {children.map((child, index) => (
          <Section key={index} name={child.props.id} scrollObserver={scrollObserver}>
            {child.props.children}
          </Section>
        ))}
      </React.Fragment>
    );
  };

  const handleScrollNavigationDrawerItemClick = (name: ScrollNavigationDrawerMenuItemName): void => {
    if (contentWrapperRef.current) {
      handleItemClick(name, contentWrapperRef.current);
    }
  };

  const scrollbarWidth = "10px";

  return (
    <div className="flex flex-row h-full w-full">
      <ScrollNavigationDrawer
        drawerOpen={drawerOpen}
        menuItems={menuItems}
        isTopSelected={isTopSelected}
        season={season}
        handleItemClick={handleScrollNavigationDrawerItemClick}
        handleDialogClose={handleDrawerClose}
        handleSeasonChange={handleSeasonChange}
      />
      <div className="h-full w-full md:w-[calc(100%-172px)] lg:w-[calc(100%-192px)] overflow-hidden">
        <div className="md:hidden">
          <TopBar handleDrawerOpen={handleDrawerOpen}/>
        </div>
        <div
          className="w-full h-[calc(100vh-57px)] sm:h-[calc(100vh-67px)] md:h-full overflow-hidden"
          ref={contentRef}
        >
          <Scrollbars
            style={{ width: "100%", height: "100%" }}
            renderView={({ style, ...p }) => (
              <div {...p} style={{ ...style }} className="scrollbars-view"/>
            )}
            renderTrackVertical={({ style, ...p }) => (
              <div {...p} style={{ ...style, width: scrollbarWidth, bottom: "2px", top: "2px", right: "2px", display: "block", position: "absolute" }} className="track-vertical"/>
            )}
            renderThumbHorizontal={({ style, ...p }) => (
              <div {...p} style={{ ...style }} className="thumb-horizontal"/>
            )}
            renderThumbVertical={({ style, ...p }) => (
              <div {...p} style={{ ...style, width: scrollbarWidth, backgroundColor: "#00000030", borderRadius: scrollbarWidth }} className="thumb-vertical"/>
            )}
          >
            <div className="h-max w-full flex flex-col items-center justify-start" ref={contentWrapperRef}>
              {renderChildren()}
            </div>
          </Scrollbars>
        </div>
      </div>
    </div>
  );
};

export default ScrollNavigation;

