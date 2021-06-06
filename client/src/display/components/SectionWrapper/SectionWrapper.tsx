import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {ScrollNavigationDrawerMenuItemName} from "../ScrollNavigation/ScrollNavigationDrawer/ScrollNavigationDrawerMenuItem/types";
import Typography from "@material-ui/core/Typography";

export type SectionWrapperProps = SectionWrapperDataProps & SectionWrapperStyleProps & SectionWrapperEventProps;

export interface SectionWrapperDataProps {
  name: ScrollNavigationDrawerMenuItemName;
}

export interface SectionWrapperStyleProps {

}

export interface SectionWrapperEventProps {

}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      height: "max-content",
      width: "100%",
    },
    title: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.palette.primary.main,
      [theme.breakpoints.up("xs")]: {
        height: "46px",
      },
      [theme.breakpoints.up("sm")]: {
        height: "57px",
      },
      [theme.breakpoints.up("md")]: {
        height: "86px",
        justifyContent: "flex-start",
      },
      [theme.breakpoints.up("lg")]: {
        height: "96px",
      },
    },
    titleText: {
      fontWeight: 200,
      color: theme.palette.primary.contrastText,
      userSelect: "none",
      [theme.breakpoints.up("xs")]: {
        fontSize: "23px",
        lineHeight: "23px",
        marginLeft: "23px",
      },
      [theme.breakpoints.up("sm")]: {
        fontSize: "27px",
        lineHeight: "27px",
        marginLeft: "27px",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "38px",
        lineHeight: "38px",
        marginLeft: "38px",
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: "42px",
        lineHeight: "42px",
        marginLeft: "42px",
      },
    },
  }),
);

const SectionWrapper: React.FC<SectionWrapperProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    name,
  } = props;

  return (
    <div className={classes.root}>
      <div className={classes.title}>
        <Typography className={classes.titleText} variant={"h3"}>
          {
            name.toUpperCase()
          }
        </Typography>
      </div>
      {
        props.children
      }
    </div>
  );
};

export default SectionWrapper;

