import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {ScrollNavigationDrawerMenuItemData, ScrollNavigationDrawerMenuItemName} from "./types";
import MaterialIcon from "../../../MaterialIcon/MaterialIcon";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import ButtonBase from '@material-ui/core/ButtonBase';

export type ScrollNavigationDrawerMenuItemProps = ScrollNavigationDrawerMenuItemDataProps & ScrollNavigationDrawerMenuItemStyleProps & ScrollNavigationDrawerMenuItemEventProps;

export interface ScrollNavigationDrawerMenuItemDataProps {
  data: ScrollNavigationDrawerMenuItemData;
}

export interface ScrollNavigationDrawerMenuItemStyleProps {

}

export interface ScrollNavigationDrawerMenuItemEventProps {
  handleMenuItemClick(name: ScrollNavigationDrawerMenuItemName): void;
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
        height: "10vw",
      },
      [theme.breakpoints.up("md")]: {
        height: "4vw",
      },
      [theme.breakpoints.up("lg")]: {
        height: "3vw",
      },
    },
    colorBar: {
      height: "100%",
      transition: theme.transitions.create("background-color", {
        easing: theme.transitions.easing.sharp,
        duration: 200,
        delay: 300,
      }),
      [theme.breakpoints.up("xs")]: {
        width: "1.5vw",
      },
      [theme.breakpoints.up("md")]: {
        width: "0.6vw",
      },
      [theme.breakpoints.up("lg")]: {
        width: "0.4vw",
      },
    },
    icon: {
      [theme.breakpoints.up("xs")]: {
        height: "6vw",
        width: "6vw",
        marginLeft: "4vw",
      },
      [theme.breakpoints.up("md")]: {
        height: "2.4vw",
        width: "2.4vw",
        marginLeft: "1.8vw",
      },
      [theme.breakpoints.up("lg")]: {
        height: "1.8vw",
        width: "1.8vw",
        marginLeft: "1.3vw",
      },
    },
    text: {
      color: "#666666",
      transition: theme.transitions.create("font-weight", {
        easing: theme.transitions.easing.sharp,
        duration: 200,
        delay: 300,
      }),
      [theme.breakpoints.up("xs")]: {
        fontSize: "4vw",
        marginLeft: "4vw",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "1.3vw",
        marginLeft: "1.3vw",
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: "1vw",
        marginLeft: "1vw",
      },
    },
  }),
);

const ScrollNavigationDrawerMenuItem: React.FC<ScrollNavigationDrawerMenuItemProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    data,
    handleMenuItemClick,
  } = props;

  const handleButtonClick = (e: React.MouseEvent<HTMLElement>): void => {
    handleMenuItemClick(data.name);
  };

  return (
    <React.Fragment>
      <ButtonBase className={classes.root} onClick={handleButtonClick}>
        <div className={classes.colorBar} style={{backgroundColor: data.active ? data.color : "#ffffff00"}}/>
        <MaterialIcon className={classes.icon} iconName={data.icon} style={{color: data.color}}/>
        <Typography className={classes.text} style={{fontWeight: data.active ? 500 : 300}}>{data.name}</Typography>
      </ButtonBase>
      <Divider dir={"horizontal"}/>
    </React.Fragment>

  );
};

export default ScrollNavigationDrawerMenuItem;

