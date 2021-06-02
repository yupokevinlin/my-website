import React, {useState} from "react";
import {createStyles, Theme, useTheme, withWidth} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Breakpoint} from "@material-ui/core/styles/createBreakpoints";
import ScrollNavigationDrawer from "./ScrollNavigationDrawer/ScrollNavigationDrawer";
import {Scrollbars} from "react-custom-scrollbars";
import {
  ScrollNavigationDrawerMenuItemData,
  ScrollNavigationDrawerMenuItemName
} from "./ScrollNavigationDrawer/ScrollNavigationDrawerMenuItem/types";

export type ScrollNavigationProps = ScrollNavigationDataProps & ScrollNavigationStyleProps & ScrollNavigationEventProps;

export interface ScrollNavigationDataProps {
  menuItems: Array<ScrollNavigationDrawerMenuItemData>;
}

export interface ScrollNavigationStyleProps {
  width: Breakpoint;
}

export interface ScrollNavigationEventProps {
  handleItemClick(name: ScrollNavigationDrawerMenuItemName): void;
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
  } = props;

  const isSmXs: boolean = /xs|sm/.test(width);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(!isSmXs);

  const handleDrawerToggle = (open: boolean): void => {
    setDrawerOpen(open);
  };

  return (
    <div className={classes.scrollNavigationRoot}>
      <ScrollNavigationDrawer width={width} drawerOpen={drawerOpen} menuItems={menuItems} handleItemClick={handleItemClick}/>
      <div className={classes.content}>
        <Scrollbars>
          <div className={classes.contentWrapper}>
            {
              props.children
            }
          </div>
        </Scrollbars>
      </div>
    </div>
  );
};

export default withWidth()(ScrollNavigation);

