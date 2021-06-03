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
        width: "calc(100% - 160px)",
      },
      [theme.breakpoints.up("lg")]: {
        width: "calc(100% - 170px)",
      },
    },
    contentOuterWrapper: {
      height: "100%",
      width: "100%",
      [theme.breakpoints.up("xs")]: {
        height: "calc(100% - 58px)",
      },
      [theme.breakpoints.up("sm")]: {
        height: "calc(100% - 58px)",
      },
      [theme.breakpoints.up("md")]: {
        height: "100%",
      },
      [theme.breakpoints.up("lg")]: {
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

  const handleDrawerOpen = (): void => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = (): void => {
    setDrawerOpen(false);
  };

  const handleScrollObserverIntersect = (entries: Array<IntersectionObserverEntry>): void => {
    if (entries.length > 0) {
      handleScroll(entries[0].target.id as ScrollNavigationDrawerMenuItemName);
    }
  };

  const contentRef: React.MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const contentWrapperRef: React.MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const [scrollObserver, setScrollObserver] = useState<IntersectionObserver>(null);
  useEffect(() => {
    if (!!contentRef) {
      const newScrollObserver: IntersectionObserver = new IntersectionObserver(handleScrollObserverIntersect, {
        root: contentRef.current,
        threshold: 1,
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
          <Scrollbars>
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

