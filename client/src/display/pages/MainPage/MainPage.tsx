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

export type MainPageProps = MainPageDataProps & MainPageStyleProps & MainPageEventProps;

export interface MainPageDataProps {

}

export interface MainPageStyleProps {

}

export interface MainPageEventProps {

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
      width: "100%",
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
      color: "#666666",
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

  const {

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
        <ScrollNavigation menuItems={menuItems} isTopSelected={isTopSelected} handleItemClick={handleItemClick} handleScroll={handleScroll}>
          <div className={classes.sectionWrapper} id={ScrollNavigationDrawerMenuItemName.PICTURE}>
            <ThemePicture handleLoadComplete={handleLoadComplete}/>
          </div>
          <div className={classes.sectionWrapper} id={ScrollNavigationDrawerMenuItemName.ABOUT}>
            <SectionWrapper name={ScrollNavigationDrawerMenuItemName.ABOUT}>
              <div className={classes.scrollTest}></div>
            </SectionWrapper>
          </div>
          <div className={classes.sectionWrapper} id={ScrollNavigationDrawerMenuItemName.EXPERIENCE}>
            <SectionWrapper name={ScrollNavigationDrawerMenuItemName.EXPERIENCE}>
              <div className={classes.scrollTest}></div>
            </SectionWrapper>
          </div>
          <div className={classes.sectionWrapper} id={ScrollNavigationDrawerMenuItemName.PROJECTS}>
            <SectionWrapper name={ScrollNavigationDrawerMenuItemName.PROJECTS}>
              <div className={classes.scrollTest}></div>
            </SectionWrapper>
          </div>
          <div className={classes.sectionWrapper} id={ScrollNavigationDrawerMenuItemName.SKILLS}>
            <SectionWrapper name={ScrollNavigationDrawerMenuItemName.SKILLS}>
              <div className={classes.scrollTest}></div>
            </SectionWrapper>
          </div>
          <div className={classes.sectionWrapper} id={ScrollNavigationDrawerMenuItemName.LANGUAGES}>
            <SectionWrapper name={ScrollNavigationDrawerMenuItemName.LANGUAGES}>
              <div className={classes.scrollTest}></div>
            </SectionWrapper>
          </div>
          <div className={classes.sectionWrapper} id={ScrollNavigationDrawerMenuItemName.EDUCATION}>
            <SectionWrapper name={ScrollNavigationDrawerMenuItemName.EDUCATION}>
              <div className={classes.scrollTest}></div>
            </SectionWrapper>
          </div>
          <div className={classes.sectionWrapper} id={ScrollNavigationDrawerMenuItemName.CONTACT}>
            <SectionWrapper name={ScrollNavigationDrawerMenuItemName.CONTACT}>
              <div className={classes.scrollTest}></div>
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

