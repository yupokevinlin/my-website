import React, {ReactElement, useEffect, useRef, useState} from "react";
import {createStyles, Theme, useTheme, withWidth} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Breakpoint} from "@material-ui/core/styles/createBreakpoints";
import ScrollNavigationDrawer from "./ScrollNavigationDrawer/ScrollNavigationDrawer";
import {Scrollbars} from "react-custom-scrollbars";
import {
  ScrollNavigationDrawerMenuItemData,
  ScrollNavigationDrawerMenuItemName
} from "./ScrollNavigationDrawer/ScrollNavigationDrawerMenuItem/types";
import Section from "../Section/Section";
import TopBar from "../TopBar/TopBar";
import {ThemePictureSeason} from "../ThemePicture/types";

export type ScrollNavigationProps = ScrollNavigationDataProps & ScrollNavigationStyleProps & ScrollNavigationEventProps;

export interface ScrollNavigationDataProps {
  menuItems: Array<ScrollNavigationDrawerMenuItemData>;
  isTopSelected: boolean;
  season: ThemePictureSeason;
}

export interface ScrollNavigationStyleProps {
  width: Breakpoint;
}

export interface ScrollNavigationEventProps {
  handleItemClick(name: ScrollNavigationDrawerMenuItemName, wrapperElement: Element): void;
  handleScroll(name: ScrollNavigationDrawerMenuItemName): void;
  handleSeasonChange(season: ThemePictureSeason): void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    scrollNavigationRoot: {
      display: "flex",
      flexDirection: "row",
      height: "100%",
      width: "100%",
    },
    contentTopBarWrapper: {
      height: "100%",
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "calc(100% - 172px)",
      },
      [theme.breakpoints.up("lg")]: {
        width: "calc(100% - 192px)",
      },
    },
    contentOuterWrapper: {
      width: "100%",
      [theme.breakpoints.up("xs")]: {
        height: "calc(100vh - 57px)",
      },
      [theme.breakpoints.up("sm")]: {
        height: "calc(100vh - 67px)",
      },
      [theme.breakpoints.up("md")]: {
        height: "100%",
      },
    },
    contentInnerWrapper: {
      height: "max-content",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
    },
  }),
);

const ScrollNavigation: React.FC<ScrollNavigationProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    menuItems,
    isTopSelected,
    season,
    width,
    handleItemClick,
    handleScroll,
    handleSeasonChange,
  } = props;

  const isSmXs: boolean = /xs|sm/.test(width);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const handleDrawerOpen = (): void => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = (): void => {
    setDrawerOpen(false);
  };

  const handleScrollObserverIntersect = (entries: Array<IntersectionObserverEntry>): void => {
    const intersectingEntry: IntersectionObserverEntry | null = entries.find(entry => entry.isIntersecting);
    if (!!intersectingEntry) {
      handleScroll(intersectingEntry.target.id as ScrollNavigationDrawerMenuItemName);
    }
  };

  const contentRef: React.MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const contentWrapperRef: React.MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const [scrollObserver, setScrollObserver] = useState<IntersectionObserver>(null);
  useEffect(() => {
    if (!!contentRef) {
      const newScrollObserver: IntersectionObserver = new IntersectionObserver(handleScrollObserverIntersect, {
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
        {
          children.map((child, index) => (
            <Section name={child.props.id} scrollObserver={scrollObserver}>
              {
                child.props.children
              }
            </Section>
          ))
        }
      </React.Fragment>
    );
  };

  const handleScrollNavigationDrawerItemClick = (name: ScrollNavigationDrawerMenuItemName): void => {
    if (contentWrapperRef.current) {
      handleItemClick(name, contentWrapperRef.current);
    }
  };

  const getScrollbarWidth = (): string => {
    return "10px";
  };

  return (
    <div className={classes.scrollNavigationRoot}>
      <ScrollNavigationDrawer width={width} drawerOpen={drawerOpen} menuItems={menuItems} isTopSelected={isTopSelected} season={season} handleItemClick={handleScrollNavigationDrawerItemClick} handleDialogClose={handleDrawerClose} handleSeasonChange={handleSeasonChange}/>
      <div className={classes.contentTopBarWrapper}>
        {
          isSmXs ? (
            <TopBar handleDrawerOpen={handleDrawerOpen}/>
          ) : null
        }
        <div className={classes.contentOuterWrapper} ref={contentRef}>
          <Scrollbars
            renderTrackVertical={({style, ...props}) => <div {...props} style={{...style, width: getScrollbarWidth(), bottom: "2px", top: "2px", right: "2px", display: "block", position: "absolute"}}  className={"track-vertical"}/>}
            renderThumbHorizontal={({style, ...props}) => <div {...props} style={{...style}} className={"thumb-horizontal"}/>}
            renderThumbVertical={({style, ...props}) => <div {...props} style={{...style, width: getScrollbarWidth(), backgroundColor: "#00000030", borderRadius: getScrollbarWidth()}} className={"thumb-vertical"}/>}
          >
            <div className={classes.contentInnerWrapper} ref={contentWrapperRef}>
              {
                renderChildren()
              }
            </div>
          </Scrollbars>
        </div>
      </div>
    </div>
  );
};

export default withWidth()(ScrollNavigation);

