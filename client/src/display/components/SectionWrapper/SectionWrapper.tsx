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
      justifyContent: "flex-start",
      backgroundColor: theme.palette.primary.main,
      [theme.breakpoints.up("xs")]: {
        height: "70px",
      },
      [theme.breakpoints.up("sm")]: {
        height: "70px",
      },
      [theme.breakpoints.up("md")]: {
        height: "90px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "100px",
      },
    },
    titleText: {
      fontWeight: 300,
      color: theme.palette.primary.contrastText,
      [theme.breakpoints.up("xs")]: {
        fontSize: "26px",
        marginLeft: "26px",
      },
      [theme.breakpoints.up("sm")]: {
        fontSize: "26px",
        marginLeft: "26px",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "28px",
        marginLeft: "28px",
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: "40px",
        marginLeft: "40px",
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

