import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import NavigationUtils from "../../../../helpers/NavigationUtils";
import Divider from "@material-ui/core/Divider";

export type EducationProps = EducationDataProps & EducationStyleProps & EducationEventProps;

export interface EducationDataProps {

}

export interface EducationStyleProps {

}

export interface EducationEventProps {

}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#FFFFFF",
      opacity: 0.8,
      [theme.breakpoints.up("xs")]: {
        height: "70vw",
        backgroundImage: "linear-gradient(#F3F3f3 1.05px, transparent 1.05px), linear-gradient(to right, #F3F3f3 1.05px, #FFFFFF 1.05px)",
        backgroundSize: "21px 21px",
      },
      [theme.breakpoints.up("sm")]: {
        height: "456px",
        backgroundImage: "linear-gradient(#F3F3f3 1.2px, transparent 1.2px), linear-gradient(to right, #F3F3f3 1.2px, #FFFFFF 1.2px)",
        backgroundSize: "24px 24px",
      },
      [theme.breakpoints.up("md")]: {
        height: "513px",
        backgroundImage: "linear-gradient(#F3F3f3 1.35px, transparent 1.35px), linear-gradient(to right, #F3F3f3 1.35px, #FFFFFF 1.35px)",
        backgroundSize: "27px 27px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "570px",
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
        height: "60vw",
        width: "95vw",
      },
      [theme.breakpoints.up("sm")]: {
        height: "376px",
        width: "90%",
      },
      [theme.breakpoints.up("md")]: {
        height: "423px",
        width: "90%",
      },
      [theme.breakpoints.up("lg")]: {
        height: "470px",
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
        height: "50vw",
      },
      [theme.breakpoints.up("sm")]: {
        height: "296px",
      },
      [theme.breakpoints.up("md")]: {
        height: "333px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "370px",
      },
    },
    imageWrapper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      height: "100%",
      width: "max-content",
    },
    image: {
      [theme.breakpoints.up("xs")]: {
        height: "12vw",
        width: "12vw",
        marginRight: "6vw",
      },
      [theme.breakpoints.up("sm")]: {
        height: "75px",
        width: "75px",
        marginRight: "37.5px",
      },
      [theme.breakpoints.up("md")]: {
        height: "84px",
        width: "84px",
        marginRight: "42px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "94px",
        width: "94px",
        marginRight: "47px",
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
      cursor: "pointer",
      color: theme.palette.primary.main,
      fontWeight: 300,
      transition: theme.transitions.create("border-bottom", {
        easing: theme.transitions.easing.sharp,
        duration: 200,
      }),
      [theme.breakpoints.up("xs")]: {
        height: "4vw",
        fontSize: "4vw",
        lineHeight: "4vw",
        marginTop: "0.4vw",
        marginBottom: "2vw",
        borderBottom: `0.2vw solid #ffffff00`,
        ["&:hover"]: {
          borderBottom: `0.2vw solid ${theme.palette.primary.main}`,
        },
      },
      [theme.breakpoints.up("sm")]: {
        height: "23px",
        fontSize: "23px",
        lineHeight: "23px",
        marginTop: "3px",
        marginBottom: "16px",
        borderBottom: `2px solid #ffffff00`,
        ["&:hover"]: {
          borderBottom: `2px solid ${theme.palette.primary.main}`,
        },
      },
      [theme.breakpoints.up("md")]: {
        height: "30px",
        fontSize: "30px",
        lineHeight: "30px",
        marginTop: "3.6px",
        marginBottom: "16px",
        borderBottom: `3.3px solid #ffffff00`,
        ["&:hover"]: {
          borderBottom: `3.3px solid ${theme.palette.primary.main}`,
        },
      },
      [theme.breakpoints.up("lg")]: {
        height: "37px",
        fontSize: "37px",
        lineHeight: "37px",
        marginTop: "4px",
        marginBottom: "18px",
        borderBottom: `4px solid #ffffff00`,
        ["&:hover"]: {
          borderBottom: `4px solid ${theme.palette.primary.main}`,
        },
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
      color: "#000000",
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
  }),
);

const Education: React.FC<EducationProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {

  } = props;

  const handleTitleClick = (e: React.MouseEvent<HTMLElement>): void => {
    NavigationUtils.goToWebsite("https://www.ubc.ca");
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={3}>
        <div className={classes.content}>
          <div className={classes.imageWrapper}>
            <img src={"./resources/ubc.svg"} className={classes.image}/>
          </div>
          <div className={classes.textWrapper}>
            <Typography className={classes.titleLink} onClick={handleTitleClick}>
              UNIVERSITY OF BRITISH COLUMBIA
            </Typography>
            <Typography className={classes.subTitle}>
              Vancouver, British Columbia, Canada
            </Typography>
            <Typography className={classes.text}>
              • Bachelor of Science in Chemistry
            </Typography>
            <Typography className={classes.text}>
              • President's Entrance Scholarship
            </Typography>
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default Education;

