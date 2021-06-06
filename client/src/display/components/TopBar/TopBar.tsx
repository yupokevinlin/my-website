import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import MaterialIcon, {MaterialIconNames} from "../MaterialIcon/MaterialIcon";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

export type TopBarProps = TopBarDataProps & TopBarStyleProps & TopBarEventProps;

export interface TopBarDataProps {

}

export interface TopBarStyleProps {

}

export interface TopBarEventProps {
  handleDrawerOpen(): void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    topBar: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      [theme.breakpoints.up("xs")]: {
        height: "57px",
      },
      [theme.breakpoints.up("sm")]: {
        height: "67px",
      },
    },
    menuButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: 0,
      [theme.breakpoints.up("xs")]: {
        width: "33px",
        height: "33px",
        marginLeft: "11px",
      },
      [theme.breakpoints.up("sm")]: {
        width: "39px",
        height: "39px",
        marginLeft: "13px",
      },
    },
    menuButtonIcon: {
      color: theme.palette.primary.main,
      [theme.breakpoints.up("xs")]: {
        fontSize: "22px",
      },
      [theme.breakpoints.up("sm")]: {
        fontSize: "26px",
      },
    },
    titleTextBar: {
      height: "100%",
      width: "calc(100% - 16vh)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      [theme.breakpoints.up("xs")]: {
        width: "calc(100% - 66px)",
      },
      [theme.breakpoints.up("sm")]: {
        width: "calc(100% - 78px)",
      },
    },
    titleTextWrapper: {
      height: "max-content",
      width: "max-content",
    },
    titleName: {
      userSelect: "none",
      fontWeight: 400,
      color: theme.palette.primary.main,
      [theme.breakpoints.up("xs")]: {
        fontSize: "23px",
        lineHeight: "23px",
        height: "23px",
        marginBottom: "4px",
      },
      [theme.breakpoints.up("sm")]: {
        fontSize: "26px",
        lineHeight: "26px",
        height: "26px",
        marginBottom: "5px",
      },
    },
    titleText: {
      userSelect: "none",
      fontWeight: 300,
      color: theme.palette.secondary.main,
      [theme.breakpoints.up("xs")]: {
        fontSize: "13px",
        lineHeight: "13px",
        height: "13px",
      },
      [theme.breakpoints.up("sm")]: {
        fontSize: "15px",
        lineHeight: "15px",
        height: "15px",
      },
    },
  }),
);

const TopBar: React.FC<TopBarProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    handleDrawerOpen,
  } = props;

  return (
    <Paper className={classes.topBar} square elevation={1}>
      <IconButton edge={"start"} className={classes.menuButton} color={"inherit"} onClick={handleDrawerOpen}>
        <MaterialIcon iconName={MaterialIconNames.Menu} className={classes.menuButtonIcon}/>
      </IconButton>
      <div className={classes.titleTextBar}>
        <Typography className={classes.titleName}>
          Kevin Lin
        </Typography>
        <Typography className={classes.titleText}>
          Full Stack Developer
        </Typography>
      </div>
    </Paper>
  );
};

export default TopBar;

