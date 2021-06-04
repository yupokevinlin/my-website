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
      height: "10vh",
    },
    menuButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: 0,
      width: "6vh",
      height: "6vh",
      marginLeft: "2vh",
    },
    menuButtonIcon: {
      color: theme.palette.primary.main,
      fontSize: "4vh",
    },
    titleTextBar: {
      height: "100%",
      width: "calc(100% - 16vh)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    titleTextWrapper: {
      height: "max-content",
      width: "max-content",
    },
    titleName: {
      userSelect: "none",
      fontWeight: 400,
      color: theme.palette.primary.main,
      fontSize: "4vh",
      lineHeight: "4vh",
      height: "4vh",
      marginBottom: "0.7vh",
    },
    titleText: {
      userSelect: "none",
      fontWeight: 300,
      color: "#666666",
      fontSize: "2.2vh",
      lineHeight: "2.2vh",
      height: "2.2vh",
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

