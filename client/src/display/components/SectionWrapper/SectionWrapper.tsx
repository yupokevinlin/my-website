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
        height: "8vh",
      },
      [theme.breakpoints.up("md")]: {
        height: "8vw",
        justifyContent: "flex-start",
      },
      [theme.breakpoints.up("lg")]: {
        height: "5vw",
      },
    },
    titleText: {
      fontWeight: 200,
      color: theme.palette.primary.contrastText,
      userSelect: "none",
      [theme.breakpoints.up("xs")]: {
        fontSize: "5vh",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "5vw",
        marginLeft: "5vw",
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: "3vw",
        marginLeft: "3vw",
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
            name
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

