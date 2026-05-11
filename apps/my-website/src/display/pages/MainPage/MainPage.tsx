import React, { useEffect, useState } from "react";
import ThemePicture from "../../components/ThemePicture/ThemePicture";
import ScrollNavigation from "../../components/ScrollNavigation/ScrollNavigation";
import { initialMenuItems } from "./types";
import {
  ScrollNavigationDrawerMenuItemData,
  ScrollNavigationDrawerMenuItemName,
} from "../../components/ScrollNavigation/ScrollNavigationDrawer/ScrollNavigationDrawerMenuItem/types";
import SectionWrapper from "../../components/SectionWrapper/SectionWrapper";
import CircularProgress from "@/components/CircularProgress";
import Typography from "@/components/Typography";
import clsx from "clsx";
import Education from "../../components/Content/Education/Education";
import Contact from "../../components/Content/Contact/Contact";
import Languages from "../../components/Content/Languages/Languages";
import Experience from "../../components/Content/Experience/Experience";
import Projects from "../../components/Content/Projects/Projects";
import Skills from "../../components/Content/Skills/Skills";
import About from "../../components/Content/About/About";
import { ThemePictureSeason } from "../../components/ThemePicture/types";
import NavigationUtils from "../../../helpers/NavigationUtils";

type SeasonVars = Record<string, string>;

const SEASON_VARS: Record<ThemePictureSeason, SeasonVars> = {
  [ThemePictureSeason.WINTER]: {
    "--primary-light":    "#71a4d2",
    "--primary-main":     "#4e8ec7",
    "--primary-dark":     "#36638b",
    "--primary-darker":   "#264458",
    "--primary-contrast": "#fff",
  },
  [ThemePictureSeason.SPRING]: {
    "--primary-light":    "#77ad5d",
    "--primary-main":     "#569935",
    "--primary-dark":     "#3c6b25",
    "--primary-darker":   "#2d5119",
    "--primary-contrast": "#fff",
  },
  [ThemePictureSeason.SUMMER]: {
    "--primary-light":    "#455b7e",
    "--primary-main":     "#17325E",
    "--primary-dark":     "#102341",
    "--primary-darker":   "#0b1929",
    "--primary-contrast": "#fff",
  },
  [ThemePictureSeason.AUTUMN]: {
    "--primary-light":    "#ed8f50",
    "--primary-main":     "#e97325",
    "--primary-dark":     "#a35019",
    "--primary-darker":   "#7a3c12",
    "--primary-contrast": "#fff",
  },
};

const applySeasonVars = (season: ThemePictureSeason): void => {
  const vars = SEASON_VARS[season];
  Object.entries(vars).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
};

export interface MainPageProps {
  handleSeasonThemeChange(season: ThemePictureSeason): void;
}

const MainPage: React.FC<MainPageProps> = (props) => {
  const [menuItems, setMenuItems] = useState<Array<ScrollNavigationDrawerMenuItemData>>(initialMenuItems);
  const [isTopSelected, setIsTopSelected] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [unmountLoadingPage, setUnmountLoadingPage] = useState<boolean>(false);
  const [season, setSeason] = useState<ThemePictureSeason>(ThemePictureSeason.WINTER);

  const { handleSeasonThemeChange } = props;

  // Apply CSS custom properties for the initial winter season on mount
  useEffect(() => {
    applySeasonVars(ThemePictureSeason.WINTER);
  }, []);

  const handleScroll = (name: ScrollNavigationDrawerMenuItemName): void => {
    setIsTopSelected(name === ScrollNavigationDrawerMenuItemName.PICTURE);
    setMenuItems((prevState) =>
      prevState.map((menuItem) => ({
        ...menuItem,
        active: menuItem.name === name,
      }))
    );
  };

  const handleSeasonChange = (newSeason: ThemePictureSeason): void => {
    setSeason(newSeason);
    setFavIcon(newSeason);
    handleSeasonThemeChange(newSeason);
    applySeasonVars(newSeason);
  };

  const setFavIcon = (s: ThemePictureSeason): void => {
    const mainIconElement = document.getElementById("main-icon") as HTMLLinkElement;
    const shortcutIconElement = document.getElementById("shortcut-icon") as HTMLLinkElement;
    const iconMap: Record<ThemePictureSeason, string> = {
      [ThemePictureSeason.SPRING]: "./resources/icons/springIcon.svg",
      [ThemePictureSeason.SUMMER]: "./resources/icons/summerIcon.svg",
      [ThemePictureSeason.AUTUMN]: "./resources/icons/autumnIcon.svg",
      [ThemePictureSeason.WINTER]: "./resources/icons/winterIcon.svg",
    };
    const href = iconMap[s];
    if (mainIconElement) mainIconElement.href = href;
    if (shortcutIconElement) shortcutIconElement.href = href;
  };

  const handleItemClick = (name: ScrollNavigationDrawerMenuItemName, wrapperElement: Element): void => {
    const htmlCollection = wrapperElement.getElementsByClassName(name);
    if (htmlCollection.length === 1) {
      htmlCollection.item(0)?.scrollIntoView({ behavior: "smooth" });
    }
    if (name === ScrollNavigationDrawerMenuItemName.RESUME) {
      NavigationUtils.download(`./resources/resume/${encodeURIComponent("Kevin Lin's Resume.pdf")}`);
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
      <div className="h-full w-full">
        <ScrollNavigation
          menuItems={menuItems}
          isTopSelected={isTopSelected}
          season={season}
          handleItemClick={handleItemClick}
          handleScroll={handleScroll}
          handleSeasonChange={handleSeasonChange}
        >
          <div className="w-full h-max" id={ScrollNavigationDrawerMenuItemName.PICTURE}>
            <ThemePicture handleLoadComplete={handleLoadComplete} season={season}/>
          </div>
          <div className="w-full h-max" id={ScrollNavigationDrawerMenuItemName.ABOUT}>
            <SectionWrapper name={ScrollNavigationDrawerMenuItemName.ABOUT}><About/></SectionWrapper>
          </div>
          <div className="w-full h-max" id={ScrollNavigationDrawerMenuItemName.EXPERIENCE}>
            <SectionWrapper name={ScrollNavigationDrawerMenuItemName.EXPERIENCE}><Experience/></SectionWrapper>
          </div>
          <div className="w-full h-max" id={ScrollNavigationDrawerMenuItemName.PROJECTS}>
            <SectionWrapper name={ScrollNavigationDrawerMenuItemName.PROJECTS}><Projects/></SectionWrapper>
          </div>
          <div className="w-full h-max" id={ScrollNavigationDrawerMenuItemName.SKILLS}>
            <SectionWrapper name={ScrollNavigationDrawerMenuItemName.SKILLS}><Skills/></SectionWrapper>
          </div>
          <div className="w-full h-max" id={ScrollNavigationDrawerMenuItemName.LANGUAGES}>
            <SectionWrapper name={ScrollNavigationDrawerMenuItemName.LANGUAGES}><Languages/></SectionWrapper>
          </div>
          <div className="w-full h-max" id={ScrollNavigationDrawerMenuItemName.EDUCATION}>
            <SectionWrapper name={ScrollNavigationDrawerMenuItemName.EDUCATION}><Education/></SectionWrapper>
          </div>
          <div className="w-full h-max" id={ScrollNavigationDrawerMenuItemName.CONTACT}>
            <SectionWrapper name={ScrollNavigationDrawerMenuItemName.CONTACT}><Contact/></SectionWrapper>
          </div>
        </ScrollNavigation>
      </div>
      {!unmountLoadingPage ? (
        <div
          className={clsx(
            "flex flex-col items-center justify-center fixed top-0 left-0 h-screen w-screen z-[1301] bg-white transition-opacity duration-500",
            isLoading ? "opacity-100" : "opacity-0"
          )}
        >
          <Typography className="!font-light !text-[5vmin] !mb-[5vmin]" style={{ color: "var(--secondary-main)" }}>
            Loading Assets... Please Wait...
          </Typography>
          <CircularProgress className="!w-[10vmin] !h-[10vmin]" disableShrink/>
        </div>
      ) : null}
    </React.Fragment>
  );
};

export default MainPage;

