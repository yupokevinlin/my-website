import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {ScrollNavigationDrawerMenuItemData, ScrollNavigationDrawerMenuItemName} from "./types";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
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
        filter: `brightness(${100 - 10}%)`,
      },
      [theme.breakpoints.up("xs")]: {

      },
      [theme.breakpoints.up("sm")]: {

      },
      [theme.breakpoints.up("md")]: {

      },
      [theme.breakpoints.up("lg")]: {
        height: "46px",
      },
    },
    colorBar: {
      height: "100%",
      [theme.breakpoints.up("xs")]: {

      },
      [theme.breakpoints.up("sm")]: {

      },
      [theme.breakpoints.up("md")]: {

      },
      [theme.breakpoints.up("lg")]: {
        width: "5px",
      },
    },
    icon: {
      [theme.breakpoints.up("xs")]: {

      },
      [theme.breakpoints.up("sm")]: {

      },
      [theme.breakpoints.up("md")]: {

      },
      [theme.breakpoints.up("lg")]: {
        height: "28px",
        width: "28px",
        marginLeft: "17px",
      },
    },
    text: {
      color: "#666666",
      [theme.breakpoints.up("xs")]: {

      },
      [theme.breakpoints.up("sm")]: {

      },
      [theme.breakpoints.up("md")]: {

      },
      [theme.breakpoints.up("lg")]: {
        fontSize: "15px",
        fontWeight: 300,
        marginLeft: "10px",
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
        <Typography className={classes.text}>{data.name}</Typography>
      </ButtonBase>
      <Divider dir={"horizontal"}/>
    </React.Fragment>

  );
};

export default ScrollNavigationDrawerMenuItem;

