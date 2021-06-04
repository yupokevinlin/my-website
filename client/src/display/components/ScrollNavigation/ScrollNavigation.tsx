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
import {initialElementsInView, IntersectingElements} from "./types";

export type ScrollNavigationProps = ScrollNavigationDataProps & ScrollNavigationStyleProps & ScrollNavigationEventProps;

export interface ScrollNavigationDataProps {
  menuItems: Array<ScrollNavigationDrawerMenuItemData>;
  isTopSelected: boolean;
}

export interface ScrollNavigationStyleProps {
  width: Breakpoint;
}

export interface ScrollNavigationEventProps {
  handleItemClick(name: ScrollNavigationDrawerMenuItemName, wrapperElement: Element): void;
  handleScroll(name: ScrollNavigationDrawerMenuItemName): void;
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
        width: "calc(100% - 15vw)",
      },
      [theme.breakpoints.up("lg")]: {
        width: "calc(100% - 12vw)",
      },
    },
    contentOuterWrapper: {
      width: "100%",
      [theme.breakpoints.up("xs")]: {
        height: "92vh",
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
    width,
    handleItemClick,
    handleScroll,
  } = props;

  const isSmXs: boolean = /xs|sm/.test(width);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const elementsInView: React.MutableRefObject<Array<IntersectingElements>> = useRef<Array<IntersectingElements>>(initialElementsInView);

  const handleDrawerOpen = (): void => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = (): void => {
    setDrawerOpen(false);
  };

  const handleScrollObserverIntersect = (entries: Array<IntersectionObserverEntry>): void => {
    elementsInView.current = elementsInView.current.map((elementInView) => {
      const matchingEntry: IntersectionObserverEntry = entries.find(entry => entry.target.id === elementInView.name);
      if (!!matchingEntry && matchingEntry.isIntersecting) {
        return {
          ...elementInView,
          visibility: matchingEntry.intersectionRatio,
        }
      } else {
        return elementInView;
      }
    });

    const sortedElementsInView: Array<IntersectingElements> = elementsInView.current.sort((a, b) => {
      if (a.visibility > b.visibility) {
        return -1;
      }
      if (a.visibility < b.visibility) {
        return 1;
      }
      return 0;
    });
    if (sortedElementsInView.length > 0) {
      handleScroll(sortedElementsInView[0].name);
    }
  };

  const contentRef: React.MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const contentWrapperRef: React.MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const [scrollObserver, setScrollObserver] = useState<IntersectionObserver>(null);
  useEffect(() => {
    if (!!contentRef) {
      const thresholds: Array<number> = Array.from(Array(99).keys()).map(e => (e + 1) / 100);
      const newScrollObserver: IntersectionObserver = new IntersectionObserver(handleScrollObserverIntersect, {
        root: contentRef.current,
        threshold: thresholds,
        rootMargin: "0px",
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
    switch (width) {
      case "xl":
      case "lg": {
        return "0.4vw";
      }
      case "md": {
        return "0.6vw";
      }
      case "sm":
      case "xs": {
        return "1.2vw";
      }
    }
  };

  return (
    <div className={classes.scrollNavigationRoot}>
      <ScrollNavigationDrawer width={width} drawerOpen={drawerOpen} menuItems={menuItems} isTopSelected={isTopSelected} handleItemClick={handleScrollNavigationDrawerItemClick} handleDialogClose={handleDrawerClose}/>
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

