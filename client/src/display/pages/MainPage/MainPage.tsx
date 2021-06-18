import React, {useState} from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import ThemePicture from "../../components/ThemePicture/ThemePicture";
import ScrollNavigation from "../../components/ScrollNavigation/ScrollNavigation";
import {initialMenuItems} from "./types";
import {
  ScrollNavigationDrawerMenuItemData,
  ScrollNavigationDrawerMenuItemName
} from "../../components/ScrollNavigation/ScrollNavigationDrawer/ScrollNavigationDrawerMenuItem/types";
import SectionWrapper from "../../components/SectionWrapper/SectionWrapper";
import CircularProgress from "@material-ui/core/CircularProgress";
import clsx from "clsx";
import Typography from "@material-ui/core/Typography";
import Education from "../../components/Content/Education/Education";
import Contact from "../../components/Content/Contact/Contact";
import Languages from "../../components/Content/Languages/Languages";
import Experience from "../../components/Content/Experience/Experience";
import Projects from "../../components/Content/Projects/Projects";
import Skills from "../../components/Content/Skills/Skills";
import About from "../../components/Content/About/About";
import {ThemePictureSeason} from "../../components/ThemePicture/types";

export type MainPageProps = MainPageDataProps & MainPageStyleProps & MainPageEventProps;

export interface MainPageDataProps {

}

export interface MainPageStyleProps {

}

export interface MainPageEventProps {
  handleSeasonThemeChange(season: ThemePictureSeason): void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: "100%",
      width: "100%",
    },
    sectionsWrapper: {
      width: "100%",
      height: "max-content",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    sectionWrapper: {
      width: "100%",
      height: "max-content",
    },
    scrollTest: {
      height: "100vh",
      maxHeight: "-webkit-fill-available",
      minHeight: "-webkit-fill-available",
      width: "100%",
      backgroundColor: "#FFFFFF",
      opacity: 0.8,
      backgroundImage: "linear-gradient(#F3F3f3 0.15vh, transparent 0.15vh), linear-gradient(to right, #F3F3f3 0.15vh, #FFFFFF 0.15vh)",
      backgroundSize: "3vh 3vh",
    },
    loadingPage: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      top: 0,
      left: 0,
      height: "100vh",
      maxHeight: "-webkit-fill-available",
      minHeight: "-webkit-fill-available",
      width: "100vw",
      opacity: 1,
      zIndex: theme.zIndex.modal + 1,
      backgroundColor: theme.palette.background.paper,
      transition: theme.transitions.create("opacity", {
        easing: theme.transitions.easing.sharp,
        duration: 500,
      }),
    },
    loadingPageComplete: {
      opacity: 0,
    },
    loadingText: {
      fontWeight: 300,
      color: theme.palette.secondary.main,
      fontSize: "5vmin",
      marginBottom: "5vmin",
    },
    loadingCircle: {
      width: "10vmin !important",
      height: "10vmin !important",
    },
  }),
);

const MainPage: React.FC<MainPageProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const [menuItems, setMenuItems] = useState<Array<ScrollNavigationDrawerMenuItemData>>(initialMenuItems);
  const [isTopSelected, setIsTopSelected] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [unmountLoadingPage, setUnmountLoadingPage] = useState<boolean>(false);
  const [season, setSeason] = useState<ThemePictureSeason>(ThemePictureSeason.WINTER);

  const {
    handleSeasonThemeChange,
  } = props;

  const handleScroll = (name: ScrollNavigationDrawerMenuItemName): void => {
    setIsTopSelected(name === ScrollNavigationDrawerMenuItemName.PICTURE);
    setMenuItems(prevState => prevState.map(menuItem => {
      if (menuItem.name === name) {
        return {
          ...menuItem,
          active: true,
        }
      } else {
        return {
          ...menuItem,
          active: false,
        }
      }
    }));
  };

  const handleSeasonChange = (season: ThemePictureSeason): void => {
    setSeason(season);
    setFavIcon(season);
    handleSeasonThemeChange(season);
  }

  const setFavIcon = (season: ThemePictureSeason): void => {
    const mainIconElement: HTMLLinkElement = document.getElementById("main-icon") as HTMLLinkElement;
    const shortcutIconElement: HTMLLinkElement = document.getElementById("shortcut-icon") as HTMLLinkElement;
    switch (season) {
      case ThemePictureSeason.SPRING: {
        if (!!mainIconElement) {
          mainIconElement.href = "./resources/icons/springIcon.svg";
        }
        if (!!shortcutIconElement) {
          shortcutIconElement.href = "./resources/icons/springIcon.svg";
        }
        break;
      }
      case ThemePictureSeason.SUMMER: {
        if (!!mainIconElement) {
          mainIconElement.href = "./resources/icons/summerIcon.svg";
        }
        if (!!shortcutIconElement) {
          shortcutIconElement.href = "./resources/icons/summerIcon.svg";
        }
        break;
      }
      case ThemePictureSeason.AUTUMN: {
        if (!!mainIconElement) {
          mainIconElement.href = "./resources/icons/autumnIcon.svg";
        }
        if (!!shortcutIconElement) {
          shortcutIconElement.href = "./resources/icons/autumnIcon.svg";
        }
        break;
      }
      case ThemePictureSeason.WINTER: {
        if (!!mainIconElement) {
          mainIconElement.href = "./resources/icons/winterIcon.svg";
        }
        if (!!shortcutIconElement) {
          shortcutIconElement.href = "./resources/icons/winterIcon.svg";
        }
        break;
      }
    }
  };

  const handleItemClick = (name: ScrollNavigationDrawerMenuItemName, wrapperElement: Element): void => {
    const htmlCollection: HTMLCollectionOf<Element> = wrapperElement.getElementsByClassName(name);
    if (htmlCollection.length === 1) {
      const matchingElement: Element = htmlCollection.item(0);
      matchingElement.scrollIntoView({behavior: "smooth"});
    }
  };

  const handleLoadComplete = (): void => {
    setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => {
        setUnmountLoadingPage(true);
      }, 500);
    }, 1000);
  };

  return (
    <React.Fragment>
      <div className={classes.root}>
        <ScrollNavigation menuItems={menuItems} isTopSelected={isTopSelected} season={season} handleItemClick={handleItemClick} handleScroll={handleScroll} handleSeasonChange={handleSeasonChange}>
          <div className={classes.sectionWrapper} id={ScrollNavigationDrawerMenuItemName.PICTURE}>
            <ThemePicture handleLoadComplete={handleLoadComplete} season={season}/>
          </div>
          <div className={classes.sectionWrapper} id={ScrollNavigationDrawerMenuItemName.ABOUT}>
            <SectionWrapper name={ScrollNavigationDrawerMenuItemName.ABOUT}>
              <About/>
            </SectionWrapper>
          </div>
          <div className={classes.sectionWrapper} id={ScrollNavigationDrawerMenuItemName.EXPERIENCE}>
            <SectionWrapper name={ScrollNavigationDrawerMenuItemName.EXPERIENCE}>
              <Experience/>
            </SectionWrapper>
          </div>
          <div className={classes.sectionWrapper} id={ScrollNavigationDrawerMenuItemName.PROJECTS}>
            <SectionWrapper name={ScrollNavigationDrawerMenuItemName.PROJECTS}>
              <Projects/>
            </SectionWrapper>
          </div>
          <div className={classes.sectionWrapper} id={ScrollNavigationDrawerMenuItemName.SKILLS}>
            <SectionWrapper name={ScrollNavigationDrawerMenuItemName.SKILLS}>
              <Skills/>
            </SectionWrapper>
          </div>
          <div className={classes.sectionWrapper} id={ScrollNavigationDrawerMenuItemName.LANGUAGES}>
            <SectionWrapper name={ScrollNavigationDrawerMenuItemName.LANGUAGES}>
              <Languages/>
            </SectionWrapper>
          </div>
          <div className={classes.sectionWrapper} id={ScrollNavigationDrawerMenuItemName.EDUCATION}>
            <SectionWrapper name={ScrollNavigationDrawerMenuItemName.EDUCATION}>
              <Education/>
            </SectionWrapper>
          </div>
          <div className={classes.sectionWrapper} id={ScrollNavigationDrawerMenuItemName.CONTACT}>
            <SectionWrapper name={ScrollNavigationDrawerMenuItemName.CONTACT}>
              <Contact/>
            </SectionWrapper>
          </div>
        </ScrollNavigation>
      </div>
      {
        !unmountLoadingPage ? (
          <div className={clsx(classes.loadingPage, {
            [classes.loadingPageComplete]: !isLoading,
          })}>
            <Typography className={classes.loadingText}>
              Loading Assets... Please Wait...
            </Typography>
            <CircularProgress className={classes.loadingCircle} disableShrink/>
          </div>
        ) : null
      }
    </React.Fragment>
  );
};

export default MainPage;

