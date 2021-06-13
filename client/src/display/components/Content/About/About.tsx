import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

export type AboutProps = AboutDataProps & AboutStyleProps & AboutEventProps;

export interface AboutDataProps {

}

export interface AboutStyleProps {

}

export interface AboutEventProps {

}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: theme.palette.background.paper,
      opacity: 0.8,
      [theme.breakpoints.up("xs")]: {
        justifyContent: "flex-start",
        height: "123vw",
        backgroundImage: "linear-gradient(#F3F3f3 1.05px, transparent 1.05px), linear-gradient(to right, #F3F3f3 1.05px, #FFFFFF 1.05px)",
        backgroundSize: "21px 21px",
      },
      [theme.breakpoints.up("sm")]: {
        justifyContent: "center",
        height: "640px",
        backgroundImage: "linear-gradient(#F3F3f3 1.2px, transparent 1.2px), linear-gradient(to right, #F3F3f3 1.2px, #FFFFFF 1.2px)",
        backgroundSize: "24px 24px",
      },
      [theme.breakpoints.up("md")]: {
        height: "720px",
        backgroundImage: "linear-gradient(#F3F3f3 1.35px, transparent 1.35px), linear-gradient(to right, #F3F3f3 1.35px, #FFFFFF 1.35px)",
        backgroundSize: "27px 27px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "800px",
        backgroundImage: "linear-gradient(#F3F3f3 1.5px, transparent 1.5px), linear-gradient(to right, #F3F3f3 1.5px, #FFFFFF 1.5px)",
        backgroundSize: "30px 30px",
      },
    },
  }),
);

const About: React.FC<AboutProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {

  } = props;

  return (
    <div className={classes.root}>
      <div style={{height: "100vh"}}/>
    </div>
  );
};

export default About;

