import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

export type LanguagesProps = LanguagesDataProps & LanguagesStyleProps & LanguagesEventProps;

export interface LanguagesDataProps {

}

export interface LanguagesStyleProps {

}

export interface LanguagesEventProps {

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
      [theme.breakpoints.up("xs")]: {
        height: "86vw",
        backgroundImage: "linear-gradient(#F3F3f3 1.05px, transparent 1.05px), linear-gradient(to right, #F3F3f3 1.05px, #FFFFFF 1.05px)",
        backgroundSize: "21px 21px",
      },
      [theme.breakpoints.up("sm")]: {
        height: "580px",
        backgroundImage: "linear-gradient(#F3F3f3 1.2px, transparent 1.2px), linear-gradient(to right, #F3F3f3 1.2px, #FFFFFF 1.2px)",
        backgroundSize: "24px 24px",
      },
      [theme.breakpoints.up("md")]: {
        height: "670px",
        backgroundImage: "linear-gradient(#F3F3f3 1.35px, transparent 1.35px), linear-gradient(to right, #F3F3f3 1.35px, #FFFFFF 1.35px)",
        backgroundSize: "27px 27px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "750px",
        backgroundImage: "linear-gradient(#F3F3f3 1.5px, transparent 1.5px), linear-gradient(to right, #F3F3f3 1.5px, #FFFFFF 1.5px)",
        backgroundSize: "30px 30px",
      },
    },
    paper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      [theme.breakpoints.up("xs")]: {
        height: "76vw",
        width: "95vw",
      },
      [theme.breakpoints.up("sm")]: {
        height: "500px",
        width: "90%",
      },
      [theme.breakpoints.up("md")]: {
        height: "580px",
        width: "90%",
      },
      [theme.breakpoints.up("lg")]: {
        height: "650px",
        width: "80%",
      },
    },
    content: {
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      width: "90%",
      [theme.breakpoints.up("xs")]: {
        height: "66vw",
      },
      [theme.breakpoints.up("sm")]: {
        height: "420px",
      },
      [theme.breakpoints.up("md")]: {
        height: "490px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "550px",
      },
    },
    textWrapper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      height: "100%",
      width: "max-content",
    },
    titleLink: {
      color: theme.palette.primary.main,
      fontWeight: 300,
      [theme.breakpoints.up("xs")]: {
        height: "4vw",
        fontSize: "4vw",
        lineHeight: "4vw",
        marginTop: "0.4vw",
        marginBottom: "2.2vw",
      },
      [theme.breakpoints.up("sm")]: {
        height: "23px",
        fontSize: "23px",
        lineHeight: "23px",
        marginTop: "3px",
        marginBottom: "18px",
      },
      [theme.breakpoints.up("md")]: {
        height: "30px",
        fontSize: "30px",
        lineHeight: "30px",
        marginTop: "3.6px",
        marginBottom: "19.3px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "37px",
        fontSize: "37px",
        lineHeight: "37px",
        marginTop: "4px",
        marginBottom: "22px",
      },
    },
    subTitle: {
      fontWeight: 400,
      color: theme.palette.secondary.main,
      [theme.breakpoints.up("xs")]: {
        height: "3.6vw",
        fontSize: "3.6vw",
        lineHeight: "3.6vw",
        marginBottom: "3.6vw",
        marginLeft: "0.1vw",
      },
      [theme.breakpoints.up("sm")]: {
        height: "19px",
        fontSize: "19px",
        lineHeight: "19px",
        marginBottom: "19px",
        marginLeft: "1px",
      },
      [theme.breakpoints.up("md")]: {
        height: "21px",
        fontSize: "21px",
        lineHeight: "21px",
        marginBottom: "21px",
        marginLeft: "2px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "23px",
        fontSize: "23px",
        lineHeight: "23px",
        marginBottom: "23px",
        marginLeft: "2px",
      },
    },
    text: {
      fontWeight: 300,
      color: theme.palette.secondary.dark,
      [theme.breakpoints.up("xs")]: {
        height: "3.6vw",
        fontSize: "3.6vw",
        lineHeight: "3.6vw",
        marginTop: "2.4vw",
        marginLeft: "0.1vw",
      },
      [theme.breakpoints.up("sm")]: {
        height: "19px",
        fontSize: "19px",
        lineHeight: "19px",
        marginTop: "12px",
        marginLeft: "1px",
      },
      [theme.breakpoints.up("md")]: {
        height: "21px",
        fontSize: "21px",
        lineHeight: "21px",
        marginTop: "13px",
        marginLeft: "2px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "23px",
        fontSize: "23px",
        lineHeight: "23px",
        marginTop: "15px",
        marginLeft: "2px",
      },
    },
    spacer: {
      [theme.breakpoints.up("xs")]: {
        height: "6vw",
      },
      [theme.breakpoints.up("sm")]: {
        height: "56px",
      },
      [theme.breakpoints.up("md")]: {
        height: "63px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "70px",
      },
    },
  }),
);

const Languages: React.FC<LanguagesProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {

  } = props;

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={3}>
        <div className={classes.content}>
          <div className={classes.textWrapper}>
            <Typography className={classes.titleLink}>
              English
            </Typography>
            <Typography className={classes.subTitle}>
              Fluent
            </Typography>
            <div className={classes.spacer}/>
            <Typography className={classes.titleLink}>
              Mandarin
            </Typography>
            <Typography className={classes.subTitle}>
              Fluent
            </Typography>
            <div className={classes.spacer}/>
            <Typography className={classes.titleLink}>
              French
            </Typography>
            <Typography className={classes.subTitle}>
              Fluent
            </Typography>
            <Typography className={classes.text}>
              • Alliance Française - DELF A1 Certification
            </Typography>
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default Languages;

