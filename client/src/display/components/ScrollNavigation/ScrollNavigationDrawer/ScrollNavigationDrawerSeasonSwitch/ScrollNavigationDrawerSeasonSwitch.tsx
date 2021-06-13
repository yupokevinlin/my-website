import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {ThemePictureSeason} from "../../../ThemePicture/types";

export type ScrollNavigationDrawerSeasonSwitchProps = ScrollNavigationDrawerSeasonSwitchDataProps & ScrollNavigationDrawerSeasonSwitchStyleProps & ScrollNavigationDrawerSeasonSwitchEventProps;

export interface ScrollNavigationDrawerSeasonSwitchDataProps {
  season: ThemePictureSeason;
}

export interface ScrollNavigationDrawerSeasonSwitchStyleProps {

}

export interface ScrollNavigationDrawerSeasonSwitchEventProps {
  handleSeasonChange(season: ThemePictureSeason): void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      width: "100%",
      backgroundColor: theme.palette.background.paper,
      transition: theme.transitions.create("filter", {
        easing: theme.transitions.easing.sharp,
        duration: 200,
      }),
      ["&:hover"]: {
        filter: `brightness(90%)`,
      },
      [theme.breakpoints.up("xs")]: {
        height: "32px",
      },
      [theme.breakpoints.up("sm")]: {
        height: "38px",
      },
      [theme.breakpoints.up("md")]: {
        height: "38px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "42px",
      },
    },
  }),
);

const ScrollNavigationDrawerSeasonSwitch: React.FC<ScrollNavigationDrawerSeasonSwitchProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {

  } = props;

  return (
    <div className={classes.root}>
      
    </div>
  );
};

export default ScrollNavigationDrawerSeasonSwitch;

