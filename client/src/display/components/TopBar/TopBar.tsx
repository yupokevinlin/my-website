import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import MaterialIcon, {MaterialIconNames} from "../MaterialIcon/MaterialIcon";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";

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
      height: "58px",
    },
    menuButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: 0,
      width: "46px",
      height: "46px",
      marginLeft: "10px",
    },
    menuButtonIcon: {
      color: theme.palette.primary.main,
      fontSize: "26px",
    },
    titleTextBar: {
      height: "100%",
      width: "calc(100% - 112px)",
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
      fontWeight: 300,
      color: theme.palette.primary.main,
      fontSize: "24px",
      lineHeight: "24px",
      height: "24px",
      marginBottom: "6px",
    },
    titleText: {
      userSelect: "none",
      fontWeight: 400,
      color: "#666666",
      fontSize: "12px",
      lineHeight: "12px",
      height: "12px",
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
    <div className={classes.topBar}>
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
    </div>
  );
};

export default TopBar;

