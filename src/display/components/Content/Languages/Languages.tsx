import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";

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
        marginBottom: "1.2vw",
      },
      [theme.breakpoints.up("sm")]: {
        height: "23px",
        fontSize: "23px",
        lineHeight: "23px",
        marginTop: "3px",
        marginBottom: "9px",
      },
      [theme.breakpoints.up("md")]: {
        height: "30px",
        fontSize: "30px",
        lineHeight: "30px",
        marginTop: "3.6px",
        marginBottom: "9.3px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "37px",
        fontSize: "37px",
        lineHeight: "37px",
        marginTop: "4px",
        marginBottom: "11px",
      },
    },
    subTitle: {
      fontWeight: 400,
      color: theme.palette.secondary.main,
      [theme.breakpoints.up("xs")]: {
        height: "3.3vw",
        fontSize: "3.3vw",
        lineHeight: "3.3vw",
        marginBottom: "3.3vw",
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
    squaresWrapper: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      width: "max-content",
      [theme.breakpoints.up("xs")]: {
        height: "3.6vw",
        marginLeft: "0.1vw",
        marginBottom: "1vw",
      },
      [theme.breakpoints.up("sm")]: {
        height: "19px",
        marginLeft: "1px",
        marginBottom: "4px",
      },
      [theme.breakpoints.up("md")]: {
        height: "21px",
        marginLeft: "2px",
        marginBottom: "5px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "23px",
        marginLeft: "2px",
        marginBottom: "5px",
      },
    },
    square: {
      backgroundColor: theme.palette.primary.main,
      [theme.breakpoints.up("xs")]: {
        height: "3.6vw",
        width: "3.6vw",
        marginRight: "1.2vw",
        boxShadow: `inset 0 0 0 0.3vw ${theme.palette.secondary.dark}`,
      },
      [theme.breakpoints.up("sm")]: {
        height: "19px",
        width: "19px",
        marginRight: "6px",
        boxShadow: `inset 0 0 0 1.5px ${theme.palette.secondary.dark}`,
      },
      [theme.breakpoints.up("md")]: {
        height: "21px",
        width: "21px",
        marginRight: "7px",
        boxShadow: `inset 0 0 0 1.75px ${theme.palette.secondary.dark}`,
      },
      [theme.breakpoints.up("lg")]: {
        height: "23px",
        width: "23px",
        marginRight: "8px",
        boxShadow: `inset 0 0 0 2px ${theme.palette.secondary.dark}`,
      },
    },
    emptySquare: {
      backgroundColor: theme.palette.background.paper,
    },
    text: {
      fontWeight: 300,
      color: theme.palette.secondary.dark,
      [theme.breakpoints.up("xs")]: {
        height: "3.3vw",
        fontSize: "3.3vw",
        lineHeight: "3.3vw",
        marginTop: "1.2vw",
        marginLeft: "0.1vw",
      },
      [theme.breakpoints.up("sm")]: {
        height: "19px",
        fontSize: "19px",
        lineHeight: "19px",
        marginTop: "6px",
        marginLeft: "1px",
      },
      [theme.breakpoints.up("md")]: {
        height: "21px",
        fontSize: "21px",
        lineHeight: "21px",
        marginTop: "6.5px",
        marginLeft: "2px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "23px",
        fontSize: "23px",
        lineHeight: "23px",
        marginTop: "7.5px",
        marginLeft: "2px",
      },
    },
    spacer: {
      [theme.breakpoints.up("xs")]: {
        height: "3.4vw",
      },
      [theme.breakpoints.up("sm")]: {
        height: "32px",
      },
      [theme.breakpoints.up("md")]: {
        height: "47px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "53px",
      },
    },
  }),
);

const Languages: React.FC<LanguagesProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {

  } = props;

  const squaresArray: Array<number> = new Array(5).fill(0);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={3}>
        <div className={classes.content}>
          <div className={classes.textWrapper}>
            <Typography className={classes.titleLink}>
              English
            </Typography>
            <div className={classes.squaresWrapper}>
              {
                squaresArray.map((value, index) => (
                  <div className={classes.square} key={index}/>
                ))
              }
            </div>
            <Typography className={classes.subTitle}>
              Fluent
            </Typography>
            <div className={classes.spacer}/>
            <Typography className={classes.titleLink}>
              Mandarin
            </Typography>
            <div className={classes.squaresWrapper}>
              {
                squaresArray.map((value, index) => (
                  <div className={classes.square} key={index}/>
                ))
              }
            </div>
            <Typography className={classes.subTitle}>
              Fluent
            </Typography>
            <div className={classes.spacer}/>
            <Typography className={classes.titleLink}>
              French
            </Typography>
            <div className={classes.squaresWrapper}>
              {
                squaresArray.map((value, index) => (
                  <div className={clsx(classes.square, {
                    [classes.emptySquare]: index > 2,
                  })} key={index}/>
                ))
              }
            </div>
            <Typography className={classes.subTitle}>
              Proficient
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

