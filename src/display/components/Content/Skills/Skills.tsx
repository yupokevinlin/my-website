import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

export type SkillsProps = SkillsDataProps & SkillsStyleProps & SkillsEventProps;

export interface SkillsDataProps {

}

export interface SkillsStyleProps {

}

export interface SkillsEventProps {

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
    contentText: {
      fontWeight: 300,
      color: theme.palette.secondary.dark,
      textAlign: "center",
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
    itemImageWrapper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-evenly",
      [theme.breakpoints.up("xs")]: {
        height: "23vw",
        width: "13vw",
        marginLeft: "4vw",
        marginRight: "4vw",
      },
      [theme.breakpoints.up("sm")]: {
        height: "19vw",
        width: "12vw",
        marginLeft: "4vw",
        marginRight: "4vw",
      },
      [theme.breakpoints.up("md")]: {
        height: "16vw",
        width: "11vw",
        marginLeft: "3vw",
        marginRight: "3vw",
      },
      [theme.breakpoints.up("lg")]: {
        height: "13vw",
        width: "7.8vw",
        marginLeft: "2vw",
        marginRight: "2vw",
      },
    },
    itemImage: {
      [theme.breakpoints.up("xs")]: {
        height: "13vw",
        maxWidth: "13vw",
      },
      [theme.breakpoints.up("sm")]: {
        height: "12vw",
        maxWidth: "12vw",
      },
      [theme.breakpoints.up("md")]: {
        height: "11vw",
        maxWidth: "11vw",
      },
      [theme.breakpoints.up("lg")]: {
        height: "7.8vw",
        maxWidth: "7.8vw",
      },
    },
    itemWrapper: {
      height: "max-content",
      width: "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
      flexWrap: "wrap",
    },
  }),
);

const Skills: React.FC<SkillsProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {

  } = props;

  const renderItem = (url: string, label: string): React.ReactElement => {
    return (
      <div className={classes.itemImageWrapper}>
        <img className={classes.itemImage} src={url}/>
        <Typography className={classes.contentText}>
          {
            label
          }
        </Typography>
      </div>
    );
  };

  return (
    <div className={classes.root}>
      <div className={classes.paperSpacer}/>
      <Paper className={classes.paper} elevation={3}>
        <div className={classes.content}>
          <div className={classes.titleWrapper}>
            <div className={classes.titleLink}>
              STYLING
            </div>
          </div>
          <div className={classes.divider}/>
          <div className={classes.textSpacer}/>
          <div className={classes.itemWrapper}>
            {
              renderItem("./resources/images/skills/css3.png", "CSS")
            }
            {
              renderItem("./resources/images/skills/sass.svg", "Sass")
            }
            {
              renderItem("./resources/images/skills/jss.svg", "JSS")
            }
            {
              renderItem("./resources/images/skills/bootstrap.png", "Bootstrap")
            }
            {
              renderItem("./resources/images/skills/mui.png", "Material UI")
            }
            {
              renderItem("./resources/images/skills/fluentui.svg", "Fluent UI")
            }
          </div>
        </div>
      </Paper>
      <div className={classes.paperSpacer}/>
      <Paper className={classes.paper} elevation={3}>
        <div className={classes.content}>
          <div className={classes.titleWrapper}>
            <div className={classes.titleLink}>
              FRONT END
            </div>
          </div>
          <div className={classes.divider}/>
          <div className={classes.textSpacer}/>
          <div className={classes.itemWrapper}>
            {
              renderItem("./resources/images/skills/html5.png", "HTML")
            }
            {
              renderItem("./resources/images/skills/jquery.png", "jQuery")
            }
            {
              renderItem("./resources/images/skills/javascript.png", "JavaScript")
            }
            {
              renderItem("./resources/images/skills/typescript.png", "TypeScript")
            }
            {
              renderItem("./resources/images/skills/react.svg", "React JSX")
            }
            {
              renderItem("./resources/images/skills/redux.svg", "Redux")
            }
            {
              renderItem("./resources/images/skills/reduxsaga.svg", "Redux Saga")
            }
            {
              renderItem("./resources/images/skills/reactnative.png", "React Native")
            }
            {
              renderItem("./resources/images/skills/electron.png", "Electron")
            }
          </div>
        </div>
      </Paper>
      <div className={classes.paperSpacer}/>
      <Paper className={classes.paper} elevation={3}>
        <div className={classes.content}>
          <div className={classes.titleWrapper}>
            <div className={classes.titleLink}>
              BACK END
            </div>
          </div>
          <div className={classes.divider}/>
          <div className={classes.textSpacer}/>
          <div className={classes.itemWrapper}>
            {
              renderItem("./resources/images/skills/node.png", "Node")
            }
            {
              renderItem("./resources/images/skills/express.svg", "Express")
            }
            {
              renderItem("./resources/images/skills/nginx.png", "Nginx")
            }
            {
              renderItem("./resources/images/skills/wildfly.svg", "Wildfly")
            }
          </div>
        </div>
      </Paper>
      <div className={classes.paperSpacer}/>
      <Paper className={classes.paper} elevation={3}>
        <div className={classes.content}>
          <div className={classes.titleWrapper}>
            <div className={classes.titleLink}>
              DATABASE
            </div>
          </div>
          <div className={classes.divider}/>
          <div className={classes.textSpacer}/>
          <div className={classes.itemWrapper}>
            {
              renderItem("./resources/images/skills/mongodb.svg", "Mongo DB")
            }
            {
              renderItem("./resources/images/skills/postgres.png", "Postgres SQL")
            }
            {
              renderItem("./resources/images/skills/mssql.svg", "Microsoft SQL")
            }
            {
              renderItem("./resources/images/skills/graphql.png", "GraphQL")
            }
          </div>
        </div>
      </Paper>
      <div className={classes.paperSpacer}/>
      <Paper className={classes.paper} elevation={3}>
        <div className={classes.content}>
          <div className={classes.titleWrapper}>
            <div className={classes.titleLink}>
              DEVOPS
            </div>
          </div>
          <div className={classes.divider}/>
          <div className={classes.textSpacer}/>
          <div className={classes.itemWrapper}>
            {
              renderItem("./resources/images/skills/git.png", "Git")
            }
            {
              renderItem("./resources/images/skills/github.png", "GitHub")
            }
            {
              renderItem("./resources/images/skills/jenkins.png", "Jenkins")
            }
            {
              renderItem("./resources/images/skills/webpack.png", "Webpack")
            }
            {
              renderItem("./resources/images/skills/selenium.png", "Selenium")
            }
            {
              renderItem("./resources/images/skills/jest.png", "Jest")
            }
            {
              renderItem("./resources/images/skills/jira.png", "JIRA")
            }
            {
              renderItem("./resources/images/skills/docker.svg", "Docker")
            }
          </div>
        </div>
      </Paper>
      <div className={classes.paperSpacer}/>
      <Paper className={classes.paper} elevation={3}>
        <div className={classes.content}>
          <div className={classes.titleWrapper}>
            <div className={classes.titleLink}>
              MACHINE LEARNING
            </div>
          </div>
          <div className={classes.divider}/>
          <div className={classes.textSpacer}/>
          <div className={classes.itemWrapper}>
            {
              renderItem("./resources/images/skills/tensorflow.svg", "Tensorflow")
            }
            {
              renderItem("./resources/images/skills/opencv.svg", "OpenCV")
            }
          </div>
        </div>
      </Paper>
      <div className={classes.paperSpacer}/>
      <Paper className={classes.paper} elevation={3}>
        <div className={classes.content}>
          <div className={classes.titleWrapper}>
            <div className={classes.titleLink}>
              OTHER LANGUAGES
            </div>
          </div>
          <div className={classes.divider}/>
          <div className={classes.textSpacer}/>
          <div className={classes.itemWrapper}>
            {
              renderItem("./resources/images/skills/java.svg", "Java")
            }
            {
              renderItem("./resources/images/skills/csharp.png", "C#")
            }
            {
              renderItem("./resources/images/skills/python.png", "Python")
            }
          </div>
        </div>
      </Paper>
      <div className={classes.paperSpacer}/>
    </div>
  );
};

export default Skills;

