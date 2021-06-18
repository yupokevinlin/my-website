import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

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
      justifyContent: "center",
      backgroundColor: theme.palette.background.paper,
      opacity: 0.8,
      height: "max-content",
      [theme.breakpoints.up("xs")]: {
        backgroundImage: "linear-gradient(#F3F3f3 1.05px, transparent 1.05px), linear-gradient(to right, #F3F3f3 1.05px, #FFFFFF 1.05px)",
        backgroundSize: "21px 21px",
      },
      [theme.breakpoints.up("sm")]: {
        backgroundImage: "linear-gradient(#F3F3f3 1.2px, transparent 1.2px), linear-gradient(to right, #F3F3f3 1.2px, #FFFFFF 1.2px)",
        backgroundSize: "24px 24px",
      },
      [theme.breakpoints.up("md")]: {
        backgroundImage: "linear-gradient(#F3F3f3 1.35px, transparent 1.35px), linear-gradient(to right, #F3F3f3 1.35px, #FFFFFF 1.35px)",
        backgroundSize: "27px 27px",
      },
      [theme.breakpoints.up("lg")]: {
        backgroundImage: "linear-gradient(#F3F3f3 1.5px, transparent 1.5px), linear-gradient(to right, #F3F3f3 1.5px, #FFFFFF 1.5px)",
        backgroundSize: "30px 30px",
      },
    },
    paper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "max-content",
      [theme.breakpoints.up("xs")]: {
        width: "95vw",
      },
      [theme.breakpoints.up("sm")]: {
        width: "90%",
      },
      [theme.breakpoints.up("md")]: {
        width: "90%",
      },
      [theme.breakpoints.up("lg")]: {
        width: "80%",
      },
    },
    paperSpacer: {
      [theme.breakpoints.up("xs")]: {
        height: "5vw",
      },
      [theme.breakpoints.up("sm")]: {
        height: "40px",
      },
      [theme.breakpoints.up("md")]: {
        height: "45px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "50px",
      },
    },
    content: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      width: "90%",
      height: "max-content",
      [theme.breakpoints.up("xs")]: {
        marginTop: "5vw",
        marginBottom: "5vw",
      },
      [theme.breakpoints.up("sm")]: {
        marginTop: "40px",
        marginBottom: "40px",
      },
      [theme.breakpoints.up("md")]: {
        marginTop: "45px",
        marginBottom: "45px",
      },
      [theme.breakpoints.up("lg")]: {
        marginTop: "50px",
        marginBottom: "50px",
      },
    },
    divider: {
      width: "100%",
      height: "1px",
      backgroundColor: theme.palette.secondary.light,
      [theme.breakpoints.up("xs")]: {
        marginBottom: "2.4vw",
        marginTop: "2.4vw",
      },
      [theme.breakpoints.up("sm")]: {
        marginBottom: "9px",
        marginTop: "9px",
      },
      [theme.breakpoints.up("md")]: {
        marginBottom: "10px",
        marginTop: "10px",
      },
      [theme.breakpoints.up("lg")]: {
        marginBottom: "11px",
        marginTop: "11px",
      },
    },
    textSpacer: {
      [theme.breakpoints.up("xs")]: {
        height: "2.4vw",
      },
      [theme.breakpoints.up("sm")]: {
        height: "12px",
      },
      [theme.breakpoints.up("md")]: {
        height: "13px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "15px",
      },
    },
    contentTitle: {
      fontWeight: 400,
      color: theme.palette.primary.main,
      borderLeftColor: theme.palette.primary.main,
      borderLeftStyle: "solid",
      [theme.breakpoints.up("xs")]: {
        fontSize: "3.96vw",
        lineHeight: "6.34vw",
        paddingLeft: "3.96vw",
        borderLeftWidth: "1vw",
      },
      [theme.breakpoints.up("sm")]: {
        fontSize: "2.38vw",
        lineHeight: "3.81vw",
        paddingLeft: "2.38vw",
        borderLeftWidth: "0.6vw",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "1.97vw",
        lineHeight: "3.15vw",
        paddingLeft: "1.97vw",
        borderLeftWidth: "0.45vw",
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: "1.44vw",
        lineHeight: "2.30vw",
        paddingLeft: "1.44vw",
        borderLeftWidth: "0.3vw",
      },
    },
    contentText: {
      fontWeight: 300,
      color: theme.palette.secondary.dark,
      [theme.breakpoints.up("xs")]: {
        fontSize: "3.3vw",
        lineHeight: "5.28vw",
      },
      [theme.breakpoints.up("sm")]: {
        fontSize: "1.98vw",
        lineHeight: "3.17vw",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "1.64vw",
        lineHeight: "2.62vw",
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: "1.20vw",
        lineHeight: "1.92vw",
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
      <div className={classes.paperSpacer}/>
      <Paper className={classes.paper} elevation={3}>
        <div className={classes.content}>
          <Typography className={classes.contentTitle} align={"left"}>
            Solutions-driven full stack developer with a passion for designing beautiful and intuitive UIs.
          </Typography>
          <div className={classes.textSpacer}/>
          <div className={classes.textSpacer}/>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentText} align={"left"}>
            Hi! I am Kevin Lin, a full stack developer based in Vancouver, Canada. My professional journey has taken me on many twists and turns. From modeling reactions as a chemist, automating excel sheets at a trading company, to working now as a full stack developer, I am always looking for better and more efficient ways of doing things.
          </Typography>
          <div className={classes.textSpacer}/>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentText} align={"left"}>
            As a full stack developer, I enjoy using my solutions-driven work ethic, my incessant love for building things, and my unquenchable thirst of learning new things to make a difference. That is why I am excited to make a big impact at a high growth company.
          </Typography>
        </div>
      </Paper>
      <div className={classes.paperSpacer}/>
    </div>
  );
};

export default About;

