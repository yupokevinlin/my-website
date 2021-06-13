import React, {useRef, useState} from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {ThemePictureSeason} from "../../../ThemePicture/types";
import Divider from "@material-ui/core/Divider";
import Menu from "@material-ui/core/Menu";
import ScrollNavigationDrawerSeasonSwitchMenuItem
  from "./ScrollNavigationDrawerSeasonSwitchMenuItem/ScrollNavigationDrawerSeasonSwitchMenuItem";
import ButtonBase from "@material-ui/core/ButtonBase";
import MaterialIcon, {MaterialIconNames} from "../../../MaterialIcon/MaterialIcon";
import Typography from "@material-ui/core/Typography";

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
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      width: "100%",
      backgroundColor: theme.palette.background.paper,
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
    divider: {
      width: "100%",
    },
    buttonWrapper: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      height: "calc(100% - 1px)",
      width: "100%",
    },
    button: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      height: "100%",
      width: "100%",
      transition: theme.transitions.create("filter", {
        easing: theme.transitions.easing.sharp,
        duration: 200,
      }),
      ["&:hover"]: {
        filter: `brightness(90%)`,
      },
      backgroundColor: theme.palette.background.paper,
    },
    iconWrapper: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      [theme.breakpoints.up("xs")]: {
        height: "19px",
        width: "19px",
        marginLeft: "18px",
      },
      [theme.breakpoints.up("sm")]: {
        height: "27px",
        width: "27px",
        marginLeft: "25px",
      },
      [theme.breakpoints.up("md")]: {
        height: "27px",
        width: "27px",
        marginLeft: "25px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "30px",
        width: "30px",
        marginLeft: "28px",
      },
    },
    icon: {
      [theme.breakpoints.up("xs")]: {
        height: "14px",
        width: "14px",
      },
      [theme.breakpoints.up("sm")]: {
        height: "20px",
        width: "20px",
      },
      [theme.breakpoints.up("md")]: {
        height: "20px",
        width: "20px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "22px",
        width: "22px",
      },
    },
    text: {
      fontWeight: 300,
      color: theme.palette.secondary.main,
      [theme.breakpoints.up("xs")]: {
        fontSize: "13px",
        marginLeft: "13px",
      },
      [theme.breakpoints.up("sm")]: {
        fontSize: "15px",
        marginLeft: "15px",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "15px",
        marginLeft: "15px",
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: "17px",
        marginLeft: "17px",
      },
    },
  }),
);

const ScrollNavigationDrawerSeasonSwitch: React.FC<ScrollNavigationDrawerSeasonSwitchProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    season,
    handleSeasonChange,
  } = props;

  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const buttonRef: React.MutableRefObject<HTMLDivElement> = useRef(null);

  const handleMenuOpen = (): void => {
    setMenuOpen(true);
  };

  const handleMenuClose = (): void => {
    setMenuOpen(false);
  };

  const handleMenuItemClick = (newSeason: ThemePictureSeason): void => {
    if (newSeason !== season) {
      handleSeasonChange(newSeason);
    }
    handleMenuClose();
  };

  const renderButton = (season: ThemePictureSeason): React.ReactElement => {
    switch (season) {
      case ThemePictureSeason.SPRING: {
        return (
          <div className={classes.button} ref={buttonRef}>
            <div className={classes.iconWrapper} style={{backgroundColor: "#569935"}}>
              <MaterialIcon iconName={MaterialIconNames.Flower} className={classes.icon} style={{color: "#ffffff"}}/>
            </div>
            <Typography className={classes.text}>
              Theme
            </Typography>
          </div>
        );
      }
      case ThemePictureSeason.SUMMER: {
        return (
          <div className={classes.button} ref={buttonRef}>
            <div className={classes.iconWrapper} style={{backgroundColor: "#17325e"}}>
              <MaterialIcon iconName={MaterialIconNames.Brightness3} className={classes.icon} style={{color: "#b9c4d8", transform: "rotate(30deg)"}}/>
            </div>
            <Typography className={classes.text}>
              Theme
            </Typography>
          </div>
        );
      }
      case ThemePictureSeason.AUTUMN: {
        return (
          <div className={classes.button} ref={buttonRef}>
            <div className={classes.iconWrapper} style={{backgroundColor: "#e97325"}}>
              <MaterialIcon iconName={MaterialIconNames.Eco} className={classes.icon} style={{color: "#f6c510"}}/>
            </div>
            <Typography className={classes.text}>
              Theme
            </Typography>
          </div>
        );
      }
      case ThemePictureSeason.WINTER: {
        return (
          <div className={classes.button} ref={buttonRef}>
            <div className={classes.iconWrapper} style={{backgroundColor: "#4e8ec7"}}>
              <MaterialIcon iconName={MaterialIconNames.Snowflake} className={classes.icon} style={{color: "#ffffff"}}/>
            </div>
            <Typography className={classes.text}>
              Theme
            </Typography>
          </div>
        );
      }
    }
  };

  return (
    <div className={classes.root}>
      <Divider className={classes.divider} dir={"horizontal"}/>
      <ButtonBase className={classes.buttonWrapper} onClick={handleMenuOpen}>
        {
          renderButton(season)
        }
      </ButtonBase>
      <Menu
        id={"season-menu"}
        anchorEl={buttonRef.current}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        keepMounted
        open={menuOpen}
        onClick={handleMenuClose}
      >
        <Divider/>
        <ScrollNavigationDrawerSeasonSwitchMenuItem season={ThemePictureSeason.SPRING} handleSeasonChange={handleMenuItemClick}/>
        <Divider/>
        <ScrollNavigationDrawerSeasonSwitchMenuItem season={ThemePictureSeason.SUMMER} handleSeasonChange={handleMenuItemClick}/>
        <Divider/>
        <ScrollNavigationDrawerSeasonSwitchMenuItem season={ThemePictureSeason.AUTUMN} handleSeasonChange={handleMenuItemClick}/>
        <Divider/>
        <ScrollNavigationDrawerSeasonSwitchMenuItem season={ThemePictureSeason.WINTER} handleSeasonChange={handleMenuItemClick}/>
        <Divider/>
      </Menu>
    </div>
  );
};

export default ScrollNavigationDrawerSeasonSwitch;

