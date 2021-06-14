import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import ImageCarousel from "../../ImageCarousel/ImageCarousel";
import Link from "@material-ui/core/Link";
import NavigationUtils from "../../../../helpers/NavigationUtils";
import Typography from "@material-ui/core/Typography";
import MaterialIcon, {MaterialIconNames} from "../../MaterialIcon/MaterialIcon";
import Button from "@material-ui/core/Button";

export type ProjectsProps = ProjectsDataProps & ProjectsStyleProps & ProjectsEventProps;

export interface ProjectsDataProps {

}

export interface ProjectsStyleProps {

}

export interface ProjectsEventProps {

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
    textWrapper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      height: "100%",
      width: "100%",
    },
    topBarWrapper: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      width: "100%",
      [theme.breakpoints.up("xs")]: {
        height: "6vw",
      },
      [theme.breakpoints.up("sm")]: {
        height: "45px",
      },
      [theme.breakpoints.up("md")]: {
        height: "50px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "55px",
      },
    },
    iconWrapper: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      [theme.breakpoints.up("xs")]: {
        height: "6vw",
        width: "6vw",
      },
      [theme.breakpoints.up("sm")]: {
        height: "45px",
        width: "45px",
      },
      [theme.breakpoints.up("md")]: {
        height: "50px",
        width: "50px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "55px",
        width: "55px",
      },
    },
    icon: {
      maxWidth: "100%",
      maxHeight: "100%",
    },
    titleWrapper: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      height: "100%",
      [theme.breakpoints.up("xs")]: {
        width: "calc(100% - 9vw)",
        marginLeft: "3vw",
      },
      [theme.breakpoints.up("sm")]: {
        width: "calc(100% - 67.5px)",
        marginLeft: "22.5px",
      },
      [theme.breakpoints.up("md")]: {
        width: "calc(100% - 50px)",
        marginLeft: "25px",
      },
      [theme.breakpoints.up("lg")]: {
        width: "calc(100% - 82.5px)",
        marginLeft: "27.5px",
      },
    },
    titleLink: {
      cursor: "pointer",
      color: theme.palette.primary.main,
      fontWeight: 300,
      fontFamily: "Roboto, sans-serif",
      transition: theme.transitions.create("border-bottom", {
        easing: theme.transitions.easing.sharp,
        duration: 200,
      }),
      [theme.breakpoints.up("xs")]: {
        height: "4vw",
        fontSize: "4vw",
        lineHeight: "4vw",
      },
      [theme.breakpoints.up("sm")]: {
        height: "2.40vw",
        fontSize: "2.40vw",
        lineHeight: "2.40vw",
      },
      [theme.breakpoints.up("md")]: {
        height: "2.34vw",
        fontSize: "2.34vw",
        lineHeight: "2.34vw",
      },
      [theme.breakpoints.up("lg")]: {
        height: "1.93vw",
        fontSize: "1.93vw",
        lineHeight: "1.93vw",
      },
    },
    roleWrapper: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      height: "100%",
      [theme.breakpoints.up("md")]: {
        width: "40%",
      },
      [theme.breakpoints.up("lg")]: {
        width: "40%",
      },
    },
    role: {
      fontWeight: 400,
      color: theme.palette.secondary.main,
      [theme.breakpoints.up("xs")]: {
        height: "3.3vw",
        fontSize: "3.3vw",
        lineHeight: "3.3vw",
      },
      [theme.breakpoints.up("sm")]: {
        height: "1.98vw",
        fontSize: "1.98vw",
        lineHeight: "1.98vw",
      },
      [theme.breakpoints.up("md")]: {
        height: "1.64vw",
        fontSize: "1.64vw",
        lineHeight: "1.64vw",
      },
      [theme.breakpoints.up("lg")]: {
        height: "1.20vw",
        fontSize: "1.20vw",
        lineHeight: "1.20vw",
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
    description: {
      fontWeight: 300,
      color: theme.palette.secondary.dark,
      fontStyle: "italic",
      [theme.breakpoints.up("xs")]: {
        fontSize: "3.3vw",
        lineHeight: "3.3vw",
      },
      [theme.breakpoints.up("sm")]: {
        fontSize: "1.98vw",
        lineHeight: "1.98vw",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "1.64vw",
        lineHeight: "1.64vw",
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: "1.20vw",
        lineHeight: "1.20vw",
      },
    },
    date: {
      fontWeight: 400,
      color: theme.palette.primary.main,
      [theme.breakpoints.up("xs")]: {
        fontSize: "3.3vw",
        lineHeight: "3.3vw",
      },
      [theme.breakpoints.up("sm")]: {
        fontSize: "1.98vw",
        lineHeight: "1.98vw",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "1.64vw",
        lineHeight: "1.64vw",
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: "1.20vw",
        lineHeight: "1.20vw",
      },
    },
    contentTitle: {
      fontWeight: 400,
      color: theme.palette.primary.dark,
      [theme.breakpoints.up("xs")]: {
        fontSize: "3.3vw",
        lineHeight: "3.3vw",
      },
      [theme.breakpoints.up("sm")]: {
        fontSize: "1.98vw",
        lineHeight: "1.98vw",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "1.64vw",
        lineHeight: "1.64vw",
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: "1.20vw",
        lineHeight: "1.20vw",
      },
    },
    contentText: {
      fontWeight: 300,
      color: theme.palette.secondary.dark,
      [theme.breakpoints.up("xs")]: {
        fontSize: "3.3vw",
        lineHeight: "3.3vw",
      },
      [theme.breakpoints.up("sm")]: {
        fontSize: "1.98vw",
        lineHeight: "1.98vw",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "1.64vw",
        lineHeight: "1.64vw",
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: "1.20vw",
        lineHeight: "1.20vw",
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
    buttonWrapper: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
      width: "100%",
      [theme.breakpoints.up("xs")]: {
        height: "6.4vw",
      },
      [theme.breakpoints.up("sm")]: {
        height: "32px",
      },
      [theme.breakpoints.up("md")]: {
        height: "36px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "40px",
      },
    },
    button: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      [theme.breakpoints.up("xs")]: {
        width: "33vw",
      },
      [theme.breakpoints.up("sm")]: {
        width: "180px",
      },
      [theme.breakpoints.up("md")]: {
        width: "202px",
      },
      [theme.breakpoints.up("lg")]: {
        width: "224px",
      },
    },
    buttonIcon: {
      color: "#fff",
      [theme.breakpoints.up("xs")]: {
        height: "4.4vw",
        width: "4.4vw",
      },
      [theme.breakpoints.up("sm")]: {
        height: "23.2px",
        width: "23.2px",
      },
      [theme.breakpoints.up("md")]: {
        height: "25.6px",
        width: "25.6px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "28.8px",
        width: "28.8px",
      },
    },
    buttonText: {
      color: "#fff",
      [theme.breakpoints.up("xs")]: {
        fontSize: "2.88vw",
        lineHeight: "2.88vw",
        marginLeft: "2.88vw",
      },
      [theme.breakpoints.up("sm")]: {
        fontSize: "15.2px",
        lineHeight: "15.2px",
        marginLeft: "15.2px",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "17.6px",
        lineHeight: "17.6px",
        marginLeft: "17.6px",
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: "19.2px",
        lineHeight: "19.2px",
        marginLeft: "19.2px",
      },
    },
    imageWrapper: {
      height: "max-content",
      width: "100%",
    },
  }),
);

const Projects: React.FC<ProjectsProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {

  } = props;

  return (
    <div className={classes.root}>
      <div className={classes.paperSpacer}/>
      <Paper className={classes.paper} elevation={3}>
        <div className={classes.content}>
          <div className={classes.textWrapper}>
            <div className={classes.topBarWrapper}>
              <div className={classes.iconWrapper}>
                <img className={classes.icon} src={"./resources/images/projects/covid19TrackerAppIcon.svg"}/>
              </div>
              <div className={classes.titleWrapper}>
                <Link className={classes.titleLink} onClick={() => {NavigationUtils.goToWebsite("https://covid-19-tracker.app/")}}>
                  COVID-19 TRACKER APP
                </Link>
              </div>
            </div>
          </div>
          <div className={classes.divider}/>
          <Typography className={classes.description}>
            An interactive website to track the Covid-19 pandemic
          </Typography>
          <div className={classes.textSpacer}/>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentTitle}>
            FRONT-END
          </Typography>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentText}>
            • React / Typescript / Material UI / Redux / Redux Saga
          </Typography>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentText}>
            • Map: ESRI
          </Typography>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentText}>
            • Charts: D3
          </Typography>
          <div className={classes.textSpacer}/>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentTitle}>
            BACK-END
          </Typography>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentText}>
            • Node / Typescript / Express / Nginx
          </Typography>
          <div className={classes.divider}/>
          <div className={classes.textSpacer}/>
          <Paper className={classes.imageWrapper} square elevation={3}>
            <ImageCarousel images={[
              "/resources/images/projects/covid-19-tracker-app1.jpg",
              "/resources/images/projects/covid-19-tracker-app2.jpg",
              "/resources/images/projects/covid-19-tracker-app3.jpg",
            ]}/>
          </Paper>
          <div className={classes.textSpacer}/>
          <div className={classes.divider}/>
          <div className={classes.textSpacer}/>
          <div className={classes.buttonWrapper}>
            <Button
              variant={"contained"}
              className={classes.button}
              color={"primary"}
              onClick={() => {NavigationUtils.goToWebsite("https://covid-19-tracker.app/")}}
            >
              <MaterialIcon iconName={MaterialIconNames.ExternalLink} className={classes.buttonIcon}/>
              <Typography className={classes.buttonText}>
                Visit
              </Typography>
            </Button>
            <Button
              variant={"contained"}
              className={classes.button}
              color={"primary"}
              onClick={() => {NavigationUtils.goToWebsite("https://github.com/yupokevinlin/covid-19-interactive-world-map")}}
            >
              <MaterialIcon iconName={MaterialIconNames.Github} className={classes.buttonIcon}/>
              <Typography className={classes.buttonText}>
                View
              </Typography>
            </Button>
          </div>
        </div>
      </Paper>
      <div className={classes.paperSpacer}/>
      <Paper className={classes.paper} elevation={3}>
        <div className={classes.content}>
          <div className={classes.textWrapper}>
            <div className={classes.topBarWrapper}>
              <div className={classes.iconWrapper}>
                <img className={classes.icon} src={"./resources/images/projects/writeMyMPIcon.svg"}/>
              </div>
              <div className={classes.titleWrapper}>
                <Link className={classes.titleLink} onClick={() => {NavigationUtils.goToWebsite("https://writemymp.ca/")}}>
                  WRITE MY MP
                </Link>
              </div>
            </div>
          </div>
          <div className={classes.divider}/>
          <Typography className={classes.description}>
            A website to help Canadians contact their Members of Parliament
          </Typography>
          <div className={classes.textSpacer}/>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentTitle}>
            FRONT-END
          </Typography>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentText}>
            • React / Typescript / Material UI / Redux / Redux Saga
          </Typography>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentText}>
            • Map: ESRI
          </Typography>
          <div className={classes.textSpacer}/>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentTitle}>
            BACK-END
          </Typography>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentText}>
            • Node / Typescript / Express / Nginx
          </Typography>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentText}>
            • Data Scraping: Cheerio
          </Typography>
          <div className={classes.divider}/>
          <div className={classes.textSpacer}/>
          <Paper className={classes.imageWrapper} square elevation={3}>
            <ImageCarousel images={[
              "/resources/images/projects/writemymp1.jpg",
              "/resources/images/projects/writemymp2.jpg",
            ]}/>
          </Paper>
          <div className={classes.textSpacer}/>
          <div className={classes.divider}/>
          <div className={classes.textSpacer}/>
          <div className={classes.buttonWrapper}>
            <Button
              variant={"contained"}
              className={classes.button}
              color={"primary"}
              onClick={() => {NavigationUtils.goToWebsite("https://writemymp.ca/")}}
            >
              <MaterialIcon iconName={MaterialIconNames.ExternalLink} className={classes.buttonIcon}/>
              <Typography className={classes.buttonText}>
                Visit
              </Typography>
            </Button>
            <Button
              variant={"contained"}
              className={classes.button}
              color={"primary"}
              onClick={() => {NavigationUtils.goToWebsite("https://github.com/yupokevinlin/write-my-mp")}}
            >
              <MaterialIcon iconName={MaterialIconNames.Github} className={classes.buttonIcon}/>
              <Typography className={classes.buttonText}>
                View
              </Typography>
            </Button>
          </div>
        </div>
      </Paper>
      <div className={classes.paperSpacer}/>
      <Paper className={classes.paper} elevation={3}>
        <div className={classes.content}>
          <div className={classes.textWrapper}>
            <div className={classes.topBarWrapper}>
              <div className={classes.iconWrapper}>
                <img className={classes.icon} src={"./resources/images/projects/electronTemplate.svg"}/>
              </div>
              <div className={classes.titleWrapper}>
                <Link className={classes.titleLink} onClick={() => {NavigationUtils.goToWebsite("https://writemymp.ca/")}}>
                  REACT ELECTRON TEMPLATE
                </Link>
              </div>
            </div>
          </div>
          <div className={classes.divider}/>
          <Typography className={classes.description}>
            A template for setting up a hot reloadable electron dev environment
          </Typography>
          <div className={classes.textSpacer}/>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentTitle}>
            FRONT-END
          </Typography>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentText}>
            • React / Typescript / Electron
          </Typography>
          <div className={classes.textSpacer}/>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentTitle}>
            BUILD
          </Typography>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentText}>
            • Webpack
          </Typography>
          <div className={classes.divider}/>
          <div className={classes.textSpacer}/>
          <Paper className={classes.imageWrapper} square elevation={3}>
            <ImageCarousel images={[
              "/resources/images/projects/electrontemplate1.jpg",
              "/resources/images/projects/electrontemplate2.jpg",
            ]}/>
          </Paper>
          <div className={classes.textSpacer}/>
          <div className={classes.divider}/>
          <div className={classes.textSpacer}/>
          <div className={classes.buttonWrapper}>
            <Button
              variant={"contained"}
              className={classes.button}
              color={"primary"}
              onClick={() => {NavigationUtils.goToWebsite("https://github.com/yupokevinlin/react-electron-typescript-template")}}
            >
              <MaterialIcon iconName={MaterialIconNames.Github} className={classes.buttonIcon}/>
              <Typography className={classes.buttonText}>
                View
              </Typography>
            </Button>
          </div>
        </div>
      </Paper>
      <div className={classes.paperSpacer}/>
    </div>
  );
};

export default Projects;

