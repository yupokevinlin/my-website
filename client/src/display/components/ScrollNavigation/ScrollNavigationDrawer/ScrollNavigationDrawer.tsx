import React, {ReactElement} from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Breakpoint} from "@material-ui/core/styles/createBreakpoints";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import {
  ScrollNavigationDrawerMenuItemData,
  ScrollNavigationDrawerMenuItemName
} from "./ScrollNavigationDrawerMenuItem/types";
import ScrollNavigationDrawerMenuItem from "./ScrollNavigationDrawerMenuItem/ScrollNavigationDrawerMenuItem";

export type ScrollNavigationDrawerProps = ScrollNavigationDrawerDataProps & ScrollNavigationDrawerStyleProps & ScrollNavigationDrawerEventProps;

export interface ScrollNavigationDrawerDataProps {
  drawerOpen: boolean;
  menuItems: Array<ScrollNavigationDrawerMenuItemData>;
}

export interface ScrollNavigationDrawerStyleProps {
  width: Breakpoint;
}

export interface ScrollNavigationDrawerEventProps {
  handleItemClick(name: ScrollNavigationDrawerMenuItemName): void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    // drawer: {
    //   width: 0,
    //   flexShrink: 0,
    //   whiteSpace: "nowrap",
    //   overflowX: "hidden",
    //   transition: theme.transitions.create("width", {
    //     easing: theme.transitions.easing.sharp,
    //     duration: theme.transitions.duration.enteringScreen,
    //   }),
    // },
    // drawerOpen: {
    //   width: "170px",
    //   transition: theme.transitions.create("width", {
    //     easing: theme.transitions.easing.sharp,
    //     duration: theme.transitions.duration.enteringScreen,
    //   }),
    // },
    listPaper: {
      height: "100%",
      [theme.breakpoints.up("lg")]: {
        width: "170px",
      },
    },
    listWrapper: {
      display: "flex",
      flexDirection: "column",
      [theme.breakpoints.up("xs")]: {

      },
      [theme.breakpoints.up("sm")]: {

      },
      [theme.breakpoints.up("md")]: {

      },
      [theme.breakpoints.up("lg")]: {
        width: "170px",
        height: "477px",
      },
    },
    header: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      [theme.breakpoints.up("xs")]: {

      },
      [theme.breakpoints.up("sm")]: {

      },
      [theme.breakpoints.up("md")]: {

      },
      [theme.breakpoints.up("lg")]: {
        height: "100px",
      },
    },
    headerTitle: {
      userSelect: "none",
      [theme.breakpoints.up("xs")]: {

      },
      [theme.breakpoints.up("sm")]: {

      },
      [theme.breakpoints.up("md")]: {

      },
      [theme.breakpoints.up("lg")]: {
        fontSize: "32px",
        lineHeight: "32px",
        height: "32px",
        marginBottom: "12px",
        fontWeight: 300,
        color: theme.palette.primary.main,
      },
    },
    headerText: {
      userSelect: "none",
      [theme.breakpoints.up("xs")]: {

      },
      [theme.breakpoints.up("sm")]: {

      },
      [theme.breakpoints.up("md")]: {

      },
      [theme.breakpoints.up("lg")]: {
        fontSize: "14px",
        lineHeight: "14px",
        height: "14px",
        fontWeight: 400,
        color: "#666666",
      },
    },
  }),
);

const ScrollNavigationDrawer: React.FC<ScrollNavigationDrawerProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    drawerOpen,
    menuItems,
    width,
    handleItemClick,
  } = props;

  const handleMenuItemClick = (name: ScrollNavigationDrawerMenuItemName): void => {
    handleItemClick(name);
  };

  const handleHeaderClick = (e: React.MouseEvent<HTMLElement>): void => {
    handleItemClick(ScrollNavigationDrawerMenuItemName.PICTURE);
  };

  const renderList = (): ReactElement => {
    return (
      <Paper className={classes.listPaper} square>
        <div className={classes.listWrapper}>
          <div className={classes.header} onClick={handleHeaderClick}>
            <Typography className={classes.headerTitle}>
              Kevin Lin
            </Typography>
            <Typography className={classes.headerText}>
              Full Stack Developer
            </Typography>
          </div>
          <Divider dir={"horizontal"}/>
          {
            menuItems.map((menuItem, index) => (
              <ScrollNavigationDrawerMenuItem data={menuItem} key={menuItem.name} handleMenuItemClick={handleMenuItemClick}/>
            ))
          }
        </div>
      </Paper>
    );
  };

  return (
    renderList()
  );

};

export default ScrollNavigationDrawer;

