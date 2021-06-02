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

export type ScrollNavigationProps = ScrollNavigationDataProps & ScrollNavigationStyleProps & ScrollNavigationEventProps;

export interface ScrollNavigationDataProps {
  menuItems: Array<ScrollNavigationDrawerMenuItemData>;
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
    content: {
      [theme.breakpoints.up("xs")]: {

      },
      [theme.breakpoints.up("sm")]: {

      },
      [theme.breakpoints.up("md")]: {

      },
      [theme.breakpoints.up("lg")]: {
        height: "100%",
        width: "calc(100% - 170px)",
      },
    },
    contentWrapper: {
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
    width,
    handleItemClick,
    handleScroll,
  } = props;

  const isSmXs: boolean = /xs|sm/.test(width);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(!isSmXs);

  const handleDrawerToggle = (open: boolean): void => {
    setDrawerOpen(open);
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
      <ScrollNavigationDrawer width={width} drawerOpen={drawerOpen} menuItems={menuItems} handleItemClick={handleScrollNavigationDrawerItemClick}/>
      <div className={classes.content} ref={contentRef}>
        <Scrollbars>
          <div className={classes.contentWrapper} ref={contentWrapperRef}>
            {
              renderChildren()
            }
          </div>
        </Scrollbars>
      </div>
    </div>
  );
};

export default withWidth()(ScrollNavigation);

