import React from "react";
import {createStyles, Theme, useTheme, withWidth} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import NavigationUtils from "../../../../helpers/NavigationUtils";
import {Breakpoint} from "@material-ui/core/styles/createBreakpoints";

export type ExperienceProps = ExperienceDataProps & ExperienceStyleProps & ExperienceEventProps;

export interface ExperienceDataProps {

}

export interface ExperienceStyleProps {
  width: Breakpoint;
}

export interface ExperienceEventProps {

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
        width: "40%",
      },
      [theme.breakpoints.up("sm")]: {
        width: "30%",
      },
      [theme.breakpoints.up("md")]: {
        width: "20%",
      },
    },
    icon: {
      maxWidth: "80%",
      maxHeight: "80%",
    },
    titleWrapper: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      height: "100%",
      [theme.breakpoints.up("xs")]: {
        width: "60%",
      },
      [theme.breakpoints.up("sm")]: {
        width: "70%",
      },
      [theme.breakpoints.up("md")]: {
        width: "40%",
      },
      [theme.breakpoints.up("lg")]: {
        width: "40%",
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
  }),
);

const Experience: React.FC<ExperienceProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    width,
  } = props;

  const isSmXs: boolean = /xs|sm/.test(width);

  return (
    <div className={classes.root}>
      <div className={classes.paperSpacer}/>
      <Paper className={classes.paper} elevation={3}>
        <div className={classes.content}>
          <div className={classes.textWrapper}>
            <div className={classes.topBarWrapper}>
              <div className={classes.iconWrapper}>
                <img className={classes.icon} src={"./resources/images/experience/serviceLink.svg"}/>
              </div>
              <div className={classes.titleWrapper}>
                <Link className={classes.titleLink} onClick={() => {NavigationUtils.goToWebsite("https://service-link.ca/")}}>
                  SERVICE LINK
                </Link>
              </div>
              {
                !isSmXs ? (
                  <div className={classes.roleWrapper}>
                    <Typography className={classes.role}>
                      Software Engineer
                    </Typography>
                  </div>
                ) : null
              }
            </div>
          </div>
          <div className={classes.divider}/>
          {
            isSmXs ? (
              <React.Fragment>
                <Typography className={classes.role}>
                  Software Engineer
                </Typography>
                <div className={classes.textSpacer}/>
              </React.Fragment>
            ) : null
          }
          <Typography className={classes.description}>
            Service Link is a workforce management system software company providing solutions to major utilities
          </Typography>
          <div className={classes.textSpacer}/>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentTitle}>
            ACHIEVEMENTS
          </Typography>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentText}>
            • Architected and designed the new client UI using React, Microsoft Fluent UI, Typescript, Redux, and Sagas.
          </Typography>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentText}>
            • Modernized and automated the build process and release notes generation using the Jenkins pipeline. Saved hours with each release.
          </Typography>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentText}>
            • Integrated the client application login process with Microsoft Azure Active Directory.
          </Typography>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentText}>
            • Integrated the application with customer ESRI map servers. Worked with customers for customization requirements.
          </Typography>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentText}>
            • Transitioned the client application from jQuery to React. Dramatically increased UI development speed by introducing modular components.
          </Typography>
          <div className={classes.textSpacer}/>
          <div className={classes.divider}/>
          <div className={classes.textSpacer}/>
          <Typography className={classes.date}>
            Jul 2019 - Present | Vancouver, Canada
          </Typography>
        </div>
      </Paper>
      <div className={classes.paperSpacer}/>
      <Paper className={classes.paper} elevation={3}>
        <div className={classes.content}>
          <div className={classes.textWrapper}>
            <div className={classes.topBarWrapper}>
              <div className={classes.iconWrapper}>
                <img className={classes.icon} src={"./resources/images/experience/serviceLink.svg"}/>
              </div>
              <div className={classes.titleWrapper}>
                <Link className={classes.titleLink} onClick={() => {NavigationUtils.goToWebsite("https://service-link.ca/")}}>
                  SERVICE LINK
                </Link>
              </div>
              {
                !isSmXs ? (
                  <div className={classes.roleWrapper}>
                    <Typography className={classes.role}>
                      Software Support Engineer
                    </Typography>
                  </div>
                ) : null
              }
            </div>
          </div>
          <div className={classes.divider}/>
          {
            isSmXs ? (
              <React.Fragment>
                <Typography className={classes.role}>
                  Software Support Engineer
                </Typography>
                <div className={classes.textSpacer}/>
              </React.Fragment>
            ) : null
          }
          <Typography className={classes.description}>
            Service Link is a workforce management system software company providing solutions to major utilities
          </Typography>
          <div className={classes.textSpacer}/>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentTitle}>
            ACHIEVEMENTS
          </Typography>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentText}>
            • Improved application security using Nginx. Allowed the application to pass the HCL (IBM) AppScan.
          </Typography>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentText}>
            • Customized the JIRA workflow using the JIRA script runner plugin.
          </Typography>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentText}>
            • Created a dynamic PDF report generator using Apache PDFBox.
          </Typography>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentText}>
            • Introduced and implemented the Gitflow Workflow to replace the Centralized Workflow. This greatly reduced merge conflicts and improved the quality of releases.
          </Typography>
          <div className={classes.textSpacer}/>
          <div className={classes.divider}/>
          <div className={classes.textSpacer}/>
          <Typography className={classes.date}>
            Jul 2018 - Jul 2019 | Vancouver, Canada
          </Typography>
        </div>
      </Paper>
      <div className={classes.paperSpacer}/>
      <Paper className={classes.paper} elevation={3}>
        <div className={classes.content}>
          <div className={classes.textWrapper}>
            <div className={classes.topBarWrapper}>
              <div className={classes.iconWrapper}>
                <img className={classes.icon} src={"./resources/images/experience/protrade.svg"}/>
              </div>
              <div className={classes.titleWrapper}>
                <Link className={classes.titleLink} onClick={() => {NavigationUtils.goToWebsite("http://www.protrade.org/")}}>
                  PROTRADE ASIA LIMITED
                </Link>
              </div>
              {
                !isSmXs ? (
                  <div className={classes.roleWrapper}>
                    <Typography className={classes.role}>
                      Contracted Software Developer
                    </Typography>
                  </div>
                ) : null
              }
            </div>
          </div>
          <div className={classes.divider}/>
          {
            isSmXs ? (
              <React.Fragment>
                <Typography className={classes.role}>
                  Contracted Software Developer
                </Typography>
                <div className={classes.textSpacer}/>
              </React.Fragment>
            ) : null
          }
          <Typography className={classes.description}>
            Protrade is a full service trading and logistics company dealing in industrial raw materials
          </Typography>
          <div className={classes.textSpacer}/>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentTitle}>
            ACHIEVEMENTS
          </Typography>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentText}>
            • Created an App written in Electron, React, and Express to parse thousands of excel spreadsheets and organize data.
          </Typography>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentText}>
            • Improved old VBA macro enhanced excel spreadsheets and reduced processing times by 3x.
          </Typography>
          <div className={classes.textSpacer}/>
          <div className={classes.divider}/>
          <div className={classes.textSpacer}/>
          <Typography className={classes.date}>
            Mar 2021 - Present | Vancouver, Canada
          </Typography>
        </div>
      </Paper>
      <div className={classes.paperSpacer}/>
      <Paper className={classes.paper} elevation={3}>
        <div className={classes.content}>
          <div className={classes.textWrapper}>
            <div className={classes.topBarWrapper}>
              <div className={classes.iconWrapper}>
                <img className={classes.icon} src={"./resources/images/experience/protrade.svg"}/>
              </div>
              <div className={classes.titleWrapper}>
                <Link className={classes.titleLink} onClick={() => {NavigationUtils.goToWebsite("http://www.protrade.org/")}}>
                  PROTRADE ASIA LIMITED
                </Link>
              </div>
              {
                !isSmXs ? (
                  <div className={classes.roleWrapper}>
                    <Typography className={classes.role}>
                      Contracted VBA Developer
                    </Typography>
                  </div>
                ) : null
              }
            </div>
          </div>
          <div className={classes.divider}/>
          {
            isSmXs ? (
              <React.Fragment>
                <Typography className={classes.role}>
                  Contracted VBA Developer
                </Typography>
                <div className={classes.textSpacer}/>
              </React.Fragment>
            ) : null
          }
          <Typography className={classes.description}>
            Protrade is a full service trading and logistics company dealing in industrial raw materials
          </Typography>
          <div className={classes.textSpacer}/>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentTitle}>
            ACHIEVEMENTS
          </Typography>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentText}>
            • Designed a VBA enhanced Customer Relationship Management excel spreadsheet.
          </Typography>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentText}>
            • Created a VBA enhanced excel spreadsheet to generate graphical reports.
          </Typography>
          <div className={classes.textSpacer}/>
          <div className={classes.divider}/>
          <div className={classes.textSpacer}/>
          <Typography className={classes.date}>
            Aug 2017 - Sep 2017 | Toronto, Canada
          </Typography>
        </div>
      </Paper>
      <div className={classes.paperSpacer}/>
      <Paper className={classes.paper} elevation={3}>
        <div className={classes.content}>
          <div className={classes.textWrapper}>
            <div className={classes.topBarWrapper}>
              <div className={classes.iconWrapper}>
                <img className={classes.icon} src={"./resources/images/experience/protrade.svg"}/>
              </div>
              <div className={classes.titleWrapper}>
                <Link className={classes.titleLink} onClick={() => {NavigationUtils.goToWebsite("http://www.protrade.org/")}}>
                  PROTRADE ASIA LIMITED
                </Link>
              </div>
              {
                !isSmXs ? (
                  <div className={classes.roleWrapper}>
                    <Typography className={classes.role}>
                      Special Assistant
                    </Typography>
                  </div>
                ) : null
              }
            </div>
          </div>
          <div className={classes.divider}/>
          {
            isSmXs ? (
              <React.Fragment>
                <Typography className={classes.role}>
                  Special Assistant
                </Typography>
                <div className={classes.textSpacer}/>
              </React.Fragment>
            ) : null
          }
          <Typography className={classes.description}>
            Protrade is a full service trading and logistics company dealing in industrial raw materials
          </Typography>
          <div className={classes.textSpacer}/>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentTitle}>
            ACHIEVEMENTS
          </Typography>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentText}>
            • Designed software to automatically send price updates via e-mails using VBA. Reduced time spent by 5x.
          </Typography>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentText}>
            • Created VBA macro enhanced excel spreadsheets to calculate and manipulate sales data to generate graphical reports.
          </Typography>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentText}>
            • Provided training for sales staff regarding the petrochemical supply chain.
          </Typography>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentText}>
            • Designed trade show posters and content.
          </Typography>
          <div className={classes.textSpacer}/>
          <Typography className={classes.contentText}>
            • Coordinated quarterly cross office meetings.
          </Typography>
          <div className={classes.textSpacer}/>
          <div className={classes.divider}/>
          <div className={classes.textSpacer}/>
          <Typography className={classes.date}>
            Oct 2016 - Jun 2017 | Taipei, Taiwan
          </Typography>
        </div>
      </Paper>
      <div className={classes.paperSpacer}/>
    </div>
  );
};

export default withWidth()(Experience);

