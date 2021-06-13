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
import ScrollNavigationDrawerSeasonSwitch
  from "./ScrollNavigationDrawerSeasonSwitch/ScrollNavigationDrawerSeasonSwitch";
import {ThemePictureSeason} from "../../ThemePicture/types";

export type ScrollNavigationDrawerProps = ScrollNavigationDrawerDataProps & ScrollNavigationDrawerStyleProps & ScrollNavigationDrawerEventProps;

export interface ScrollNavigationDrawerDataProps {
  drawerOpen: boolean;
  menuItems: Array<ScrollNavigationDrawerMenuItemData>;
  isTopSelected: boolean;
  season: ThemePictureSeason;
}

export interface ScrollNavigationDrawerStyleProps {
  width: Breakpoint;
}

export interface ScrollNavigationDrawerEventProps {
  handleItemClick(name: ScrollNavigationDrawerMenuItemName): void;
  handleDialogClose(): void;
  handleSeasonChange(season: ThemePictureSeason): void;
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
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "space-between",
      [theme.breakpoints.up("xs")]: {
        height: "100vh",
        maxHeight: "-webkit-fill-available",
        minHeight: "-webkit-fill-available",
        width: "128px",
      },
      [theme.breakpoints.up("sm")]: {
        height: "100vh",
        maxHeight: "-webkit-fill-available",
        minHeight: "-webkit-fill-available",
        width: "160px",
      },
      [theme.breakpoints.up("md")]: {
        height: "100%",
        width: "172px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "100%",
        width: "192px",
      },
    },
    listWrapper: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      [theme.breakpoints.up("xs")]: {
        height: "297px",
      },
      [theme.breakpoints.up("sm")]: {
        height: "351px",
      },
      [theme.breakpoints.up("md")]: {
        height: "383px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "423px",
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
        height: "70px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "78px",
      },
    },
    headerTitle: {
      userSelect: "none",
      fontWeight: 300,
      color: theme.palette.primary.main,
      [theme.breakpoints.up("md")]: {
        fontSize: "30px",
        lineHeight: "30px",
        height: "30px",
        marginBottom: "7px",
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: "34px",
        lineHeight: "34px",
        height: "34px",
        marginBottom: "8px",
      },
    },
    headerText: {
      userSelect: "none",
      fontWeight: 400,
      color: theme.palette.secondary.main,
      [theme.breakpoints.up("md")]: {
        fontSize: "15px",
        lineHeight: "15px",
        height: "15px",
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: "17px",
        lineHeight: "17px",
        height: "17px",
      },
    },
    dialogPaper: {
      height: "100vh",
      maxHeight: "-webkit-fill-available",
      minHeight: "-webkit-fill-available",
      margin: 0,
      borderRadius: 0,
      width: "max-content",
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
    season,
    width,
    handleItemClick,
    handleDialogClose,
    handleSeasonChange,
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
                color: theme.palette.secondary.main,
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
        <ScrollNavigationDrawerSeasonSwitch season={season} handleSeasonChange={handleSeasonChange}/>
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

