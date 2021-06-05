import React, {ReactElement} from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Breakpoint} from "@material-ui/core/styles/createBreakpoints";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import {TransitionProps} from "@material-ui/core/transitions";
import {
  ScrollNavigationDrawerMenuItemData,
  ScrollNavigationDrawerMenuItemName
} from "./ScrollNavigationDrawerMenuItem/types";
import ScrollNavigationDrawerMenuItem from "./ScrollNavigationDrawerMenuItem/ScrollNavigationDrawerMenuItem";
import {MaterialIconNames} from "../../MaterialIcon/MaterialIcon";

export type ScrollNavigationDrawerProps = ScrollNavigationDrawerDataProps & ScrollNavigationDrawerStyleProps & ScrollNavigationDrawerEventProps;

export interface ScrollNavigationDrawerDataProps {
  drawerOpen: boolean;
  menuItems: Array<ScrollNavigationDrawerMenuItemData>;
  isTopSelected: boolean;
}

export interface ScrollNavigationDrawerStyleProps {
  width: Breakpoint;
}

export interface ScrollNavigationDrawerEventProps {
  handleItemClick(name: ScrollNavigationDrawerMenuItemName): void;
  handleDialogClose(): void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      height: "100%",
      width: 0,
      flexShrink: 0,
      whiteSpace: "nowrap",
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerOpen: {
      height: "100%",
      width: "max-content",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    listPaper: {
      [theme.breakpoints.up("xs")]: {
        height: "100vh",
        maxHeight: "-webkit-fill-available",
        minHeight: "-webkit-fill-available",
        width: "40vw",
      },
      [theme.breakpoints.up("sm")]: {
        height: "100vh",
        maxHeight: "-webkit-fill-available",
        minHeight: "-webkit-fill-available",
        width: "24vw",
      },
      [theme.breakpoints.up("md")]: {
        height: "100%",
        width: "13vw",
      },
      [theme.breakpoints.up("lg")]: {
        height: "100%",
        width: "10vw",
      },
    },
    listWrapper: {
      display: "flex",
      flexDirection: "column",
      [theme.breakpoints.up("xs")]: {
        width: "40vw",
        height: "calc(9px + 90vw)",
      },
      [theme.breakpoints.up("sm")]: {
        width: "30vw",
        height: "calc(9px + 54vw)",
      },
      [theme.breakpoints.up("md")]: {
        width: "13vw",
        height: "calc(9px + 28.8vw)",
      },
      [theme.breakpoints.up("lg")]: {
        width: "10vw",
        height: "calc(9px + 21.6vw)",
      },
    },
    header: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      [theme.breakpoints.up("md")]: {
        height: "7vw",
      },
      [theme.breakpoints.up("lg")]: {
        height: "5vw",
      },
    },
    headerTitle: {
      userSelect: "none",
      fontWeight: 300,
      color: theme.palette.primary.main,
      [theme.breakpoints.up("md")]: {
        fontSize: "2.3vw",
        lineHeight: "2.3vw",
        height: "2.3vw",
        marginBottom: "0.65vw",
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: "1.8vw",
        lineHeight: "1.8vw",
        height: "1.8vw",
        marginBottom: "0.35vw",
      },
    },
    headerText: {
      userSelect: "none",
      fontWeight: 400,
      color: "#666666",
      [theme.breakpoints.up("md")]: {
        fontSize: "1.15vw",
        lineHeight: "1.15vw",
        height: "1.15vw",
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: "0.9vw",
        lineHeight: "0.9vw",
        height: "0.9vw",
      },
    },
    dialogPaper: {
      height: "100vh",
      maxHeight: "-webkit-fill-available",
      minHeight: "-webkit-fill-available",
      margin: 0,
      borderRadius: 0,
      [theme.breakpoints.up("xs")]: {
        width: "40vw",
      },
      [theme.breakpoints.up("sm")]: {
        width: "24vw",
      },
    },
    dialogContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      height: "auto",
      width: "100%",
    },
  }),
);

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="right" ref={ref} {...props} />;
});

const ScrollNavigationDrawer: React.FC<ScrollNavigationDrawerProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    drawerOpen,
    menuItems,
    isTopSelected,
    width,
    handleItemClick,
    handleDialogClose,
  } = props;

  const isSmXs: boolean = /xs|sm/.test(width);

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
          {
            isSmXs ? (
              <ScrollNavigationDrawerMenuItem data={{
                name: ScrollNavigationDrawerMenuItemName.PICTURE,
                icon: MaterialIconNames.ArrowUpward,
                color: "#666666",
                active: isTopSelected,
              }} key={ScrollNavigationDrawerMenuItemName.PICTURE} handleMenuItemClick={handleMenuItemClick}/>
            ) : (
              <React.Fragment>
                <div className={classes.header} onClick={handleHeaderClick}>
                  <Typography className={classes.headerTitle}>
                    Kevin Lin
                  </Typography>
                  <Typography className={classes.headerText}>
                    Full Stack Developer
                  </Typography>
                </div>
                <Divider dir={"horizontal"}/>
              </React.Fragment>
            )
          }
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
    <React.Fragment>
      {
        isSmXs ? (
          <Dialog classes={{
            container: classes.dialogContainer,
            paper: classes.dialogPaper,
          }} open={drawerOpen} TransitionComponent={Transition} onClose={handleDialogClose}>
            {
              renderList()
            }
          </Dialog>
        ) : (
          renderList()
        )
      }
    </React.Fragment>
  );

};

export default ScrollNavigationDrawer;

