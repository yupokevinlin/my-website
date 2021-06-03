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
      height: "600px",
      width: "100%",
    },
  }),
);

const MainPage: React.FC<MainPageProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const [menuItems, setMenuItems] = useState<Array<ScrollNavigationDrawerMenuItemData>>(initialMenuItems);
  const [isTopSelected, setIsTopSelected] = useState<boolean>(true);

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

  return (
    <div className={classes.root}>
      <ScrollNavigation menuItems={menuItems} isTopSelected={isTopSelected} handleItemClick={handleItemClick} handleScroll={handleScroll}>
        <div className={classes.sectionWrapper} id={ScrollNavigationDrawerMenuItemName.PICTURE}>
          <ThemePicture/>
        </div>
        <div className={classes.sectionWrapper} id={ScrollNavigationDrawerMenuItemName.ABOUT}>
          <div className={classes.scrollTest}>{
            ScrollNavigationDrawerMenuItemName.ABOUT
          }</div>
        </div>
        <div className={classes.sectionWrapper} id={ScrollNavigationDrawerMenuItemName.EXPERIENCE}>
          <div className={classes.scrollTest}>{
            ScrollNavigationDrawerMenuItemName.EXPERIENCE
          }</div>
        </div>
        <div className={classes.sectionWrapper} id={ScrollNavigationDrawerMenuItemName.PROJECTS}>
          <div className={classes.scrollTest}>{
            ScrollNavigationDrawerMenuItemName.PROJECTS
          }</div>
        </div>
        <div className={classes.sectionWrapper} id={ScrollNavigationDrawerMenuItemName.SKILLS}>
          <div className={classes.scrollTest}>{
            ScrollNavigationDrawerMenuItemName.SKILLS
          }</div>
        </div>
        <div className={classes.sectionWrapper} id={ScrollNavigationDrawerMenuItemName.LANGUAGES}>
          <div className={classes.scrollTest}>{
            ScrollNavigationDrawerMenuItemName.LANGUAGES
          }</div>
        </div>
        <div className={classes.sectionWrapper} id={ScrollNavigationDrawerMenuItemName.EDUCATION}>
          <div className={classes.scrollTest}>{
            ScrollNavigationDrawerMenuItemName.EDUCATION
          }</div>
        </div>
        <div className={classes.sectionWrapper} id={ScrollNavigationDrawerMenuItemName.CONTACT}>
          <div className={classes.scrollTest}>{
            ScrollNavigationDrawerMenuItemName.CONTACT
          }</div>
        </div>
      </ScrollNavigation>
    </div>
  );
};

export default MainPage;

