import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {ThemePictureSeason} from "../../../../ThemePicture/types";
import ButtonBase from "@material-ui/core/ButtonBase";
import MaterialIcon, {MaterialIconNames} from "../../../../MaterialIcon/MaterialIcon";
import Typography from "@material-ui/core/Typography";

export type ScrollNavigationDrawerSeasonSwitchMenuItemProps = ScrollNavigationDrawerSeasonSwitchMenuItemDataProps & ScrollNavigationDrawerSeasonSwitchMenuItemStyleProps & ScrollNavigationDrawerSeasonSwitchMenuItemEventProps;

export interface ScrollNavigationDrawerSeasonSwitchMenuItemDataProps {
  season: ThemePictureSeason;
}

export interface ScrollNavigationDrawerSeasonSwitchMenuItemStyleProps {

}

export interface ScrollNavigationDrawerSeasonSwitchMenuItemEventProps {
  handleSeasonChange(season: ThemePictureSeason): void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      cursor: "pointer",
      userSelect: "none",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      width: "max-content",
      backgroundColor: theme.palette.background.paper,
      transition: theme.transitions.create("filter", {
        easing: theme.transitions.easing.sharp,
        duration: 200,
      }),
      ["&:hover"]: {
        filter: `brightness(90%)`,
      },
      [theme.breakpoints.up("xs")]: {
        height: "22px",
        width: "138px",
      },
      [theme.breakpoints.up("sm")]: {
        height: "28px",
        width: "166px",
      },
      [theme.breakpoints.up("md")]: {
        height: "28px",
        width: "166px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "32px",
        width: "207px",
      },
    },
    iconWrapper: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      [theme.breakpoints.up("xs")]: {
        height: "18px",
        width: "18px",
        marginLeft: "14px",
      },
      [theme.breakpoints.up("sm")]: {
        height: "22px",
        width: "22px",
        marginLeft: "18px",
      },
      [theme.breakpoints.up("md")]: {
        height: "22px",
        width: "22px",
        marginLeft: "18px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "24px",
        width: "24px",
        marginLeft: "22px",
      },
    },
    icon: {
      [theme.breakpoints.up("xs")]: {
        height: "12px",
        width: "12px",
      },
      [theme.breakpoints.up("sm")]: {
        height: "16px",
        width: "16px",
      },
      [theme.breakpoints.up("md")]: {
        height: "16px",
        width: "16px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "18px",
        width: "18px",
      },
    },
    text: {
      fontWeight: 300,
      color: theme.palette.secondary.main,
      [theme.breakpoints.up("xs")]: {
        fontSize: "12px",
        lineHeight: "12px",
        marginLeft: "7px",
        marginRight: "14px",
      },
      [theme.breakpoints.up("sm")]: {
        fontSize: "14px",
        lineHeight: "14px",
        marginLeft: "9px",
        marginRight: "18px",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "14px",
        lineHeight: "14px",
        marginLeft: "9px",
        marginRight: "18px",
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: "17px",
        lineHeight: "17px",
        marginLeft: "11px",
        marginRight: "22px",
      },
    },
  }),
);

const ScrollNavigationDrawerSeasonSwitchMenuItem: React.FC<ScrollNavigationDrawerSeasonSwitchMenuItemProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    season,
    handleSeasonChange,
  } = props;

  const handleButtonClick = (e: React.MouseEvent<HTMLElement>): void => {
    handleSeasonChange(season);
  };

  switch (season) {
    case ThemePictureSeason.SPRING: {
      return (
        <ButtonBase className={classes.root} onClick={handleButtonClick}>
          <div className={classes.iconWrapper} style={{backgroundColor: "#569935"}}>
            <MaterialIcon iconName={MaterialIconNames.Flower} className={classes.icon} style={{color: "#ffffff"}}/>
          </div>
          <Typography className={classes.text}>
            Spring Theme
          </Typography>
        </ButtonBase>
      );
    }
    case ThemePictureSeason.SUMMER: {
      return (
        <ButtonBase className={classes.root} onClick={handleButtonClick}>
          <div className={classes.iconWrapper} style={{backgroundColor: "#17325e"}}>
            <MaterialIcon iconName={MaterialIconNames.Brightness3} className={classes.icon} style={{color: "#b9c4d8", transform: "rotate(30deg)"}}/>
          </div>
          <Typography className={classes.text}>
            Summer Theme
          </Typography>
        </ButtonBase>
      );
    }
    case ThemePictureSeason.AUTUMN: {
      return (
        <ButtonBase className={classes.root} onClick={handleButtonClick}>
          <div className={classes.iconWrapper} style={{backgroundColor: "#e97325"}}>
            <MaterialIcon iconName={MaterialIconNames.Eco} className={classes.icon} style={{color: "#f6c510"}}/>
          </div>
          <Typography className={classes.text}>
            Autumn Theme
          </Typography>
        </ButtonBase>
      );
    }
    case ThemePictureSeason.WINTER: {
      return (
        <ButtonBase className={classes.root} onClick={handleButtonClick}>
          <div className={classes.iconWrapper} style={{backgroundColor: "#4e8ec7"}}>
            <MaterialIcon iconName={MaterialIconNames.Snowflake} className={classes.icon} style={{color: "#ffffff"}}/>
          </div>
          <Typography className={classes.text}>
            Winter Theme
          </Typography>
        </ButtonBase>
      );
    }
  }
};

export default ScrollNavigationDrawerSeasonSwitchMenuItem;

