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
    colorBar: {
      height: "100%",
      transition: theme.transitions.create("background-color", {
        easing: theme.transitions.easing.sharp,
        duration: 200,
        delay: 300,
      }),
      [theme.breakpoints.up("xs")]: {
        width: "5px",
      },
      [theme.breakpoints.up("sm")]: {
        width: "6px",
      },
      [theme.breakpoints.up("md")]: {
        width: "6px",
      },
      [theme.breakpoints.up("lg")]: {
        width: "7px",
      },
    },
    icon: {
      [theme.breakpoints.up("xs")]: {
        height: "19px",
        width: "19px",
        marginLeft: "13px",
      },
      [theme.breakpoints.up("sm")]: {
        height: "27px",
        width: "27px",
        marginLeft: "19px",
      },
      [theme.breakpoints.up("md")]: {
        height: "27px",
        width: "27px",
        marginLeft: "19px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "30px",
        width: "30px",
        marginLeft: "21px",
      },
    },
    text: {
      color: theme.palette.secondary.main,
      transition: theme.transitions.create("font-weight", {
        easing: theme.transitions.easing.sharp,
        duration: 200,
        delay: 300,
      }),
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

