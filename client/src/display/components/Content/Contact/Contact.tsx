import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import MaterialIcon, {MaterialIconNames} from "../../MaterialIcon/MaterialIcon";
import NavigationUtils from "../../../../helpers/NavigationUtils";

export type ContactProps = ContactDataProps & ContactStyleProps & ContactEventProps;

export interface ContactDataProps {

}

export interface ContactStyleProps {

}

export interface ContactEventProps {

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
    paper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      [theme.breakpoints.up("xs")]: {
        height: "90vw",
        width: "95vw",
        marginTop: "5vw",
      },
      [theme.breakpoints.up("sm")]: {
        height: "560px",
        width: "90%",
        marginTop: 0,
      },
      [theme.breakpoints.up("md")]: {
        height: "630px",
        width: "90%",
        marginTop: 0,
      },
      [theme.breakpoints.up("lg")]: {
        height: "700px",
        width: "80%",
        marginTop: 0,
      },
    },
    content: {
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      width: "90%",
      [theme.breakpoints.up("xs")]: {
        height: "80vw",
      },
      [theme.breakpoints.up("sm")]: {
        height: "480px",
      },
      [theme.breakpoints.up("md")]: {
        height: "540px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "600px",
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
    buttonRow: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      [theme.breakpoints.up("xs")]: {
        height: "8vw",
        width: "60vw",
        marginBottom: "6vw",
      },
      [theme.breakpoints.up("sm")]: {
        height: "40px",
        width: "320px",
        marginBottom: "32px",
      },
      [theme.breakpoints.up("md")]: {
        height: "45px",
        width: "360px",
        marginBottom: "36px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "50px",
        width: "400px",
        marginBottom: "40px",
      },
    },
    buttonIcon: {
      color: "#fff",
      [theme.breakpoints.up("xs")]: {
        height: "5.5vw",
        width: "5.5vw",
        marginLeft: "11vw",
      },
      [theme.breakpoints.up("sm")]: {
        height: "29px",
        width: "29px",
        marginLeft: "70px",
      },
      [theme.breakpoints.up("md")]: {
        height: "32px",
        width: "32px",
        marginLeft: "80px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "36px",
        width: "36px",
        marginLeft: "100px",
      },
    },
    buttonText: {
      color: "#fff",
      [theme.breakpoints.up("xs")]: {
        fontSize: "3.6vw",
        lineHeight: "3.6vw",
        marginLeft: "3.6vw",
      },
      [theme.breakpoints.up("sm")]: {
        fontSize: "19px",
        lineHeight: "19px",
        marginLeft: "19px",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "22px",
        lineHeight: "22px",
        marginLeft: "22px",
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: "24px",
        lineHeight: "24px",
        marginLeft: "24px",
      },
    },
  }),
);

const Contact: React.FC<ContactProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {

  } = props;

  const handleLinkedInButtonClick = (e: React.MouseEvent<HTMLElement>): void => {
    NavigationUtils.goToWebsite("https://www.linkedin.com/in/kevinyupolin");
  };

  const handleEmailButtonClick = (e: React.MouseEvent<HTMLElement>): void => {
    NavigationUtils.sendEmail("kevinyupolin@gmail.com");
  };

  const handleGitHubButtonClick = (e: React.MouseEvent<HTMLElement>): void => {
    NavigationUtils.goToWebsite("https://github.com/yupokevinlin");
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={3}>
        <div className={classes.content}>
          <div className={classes.textWrapper}>
            <Typography className={classes.titleLink}>
              LinkedIn
            </Typography>
            <Typography className={classes.subTitle}>
              https://www.linkedin.com/in/kevinyupolin
            </Typography>
            <Button
              variant={"contained"}
              className={classes.buttonRow}
              style={{backgroundColor: "#0072b1"}}
              onClick={handleLinkedInButtonClick}
            >
              <MaterialIcon iconName={MaterialIconNames.LinkedIn} className={classes.buttonIcon}/>
              <Typography className={classes.buttonText}>
                Connect
              </Typography>
            </Button>

            <Typography className={classes.titleLink}>
              E Mail
            </Typography>
            <Typography className={classes.subTitle}>
              kevinyupolin@gmail.com
            </Typography>
            <Button
              variant={"contained"}
              className={classes.buttonRow}
              style={{backgroundColor: "#ea4335"}}
              onClick={handleEmailButtonClick}
            >
              <MaterialIcon iconName={MaterialIconNames.Mail} className={classes.buttonIcon}/>
              <Typography className={classes.buttonText}>
                Contact
              </Typography>
            </Button>

            <Typography className={classes.titleLink}>
              GitHub
            </Typography>
            <Typography className={classes.subTitle}>
              https://github.com/yupokevinlin
            </Typography>
            <Button
              variant={"contained"}
              className={classes.buttonRow}
              style={{backgroundColor: "#24292e"}}
              onClick={handleGitHubButtonClick}
            >
              <MaterialIcon iconName={MaterialIconNames.Github} className={classes.buttonIcon}/>
              <Typography className={classes.buttonText}>
                View
              </Typography>
            </Button>
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default Contact;

