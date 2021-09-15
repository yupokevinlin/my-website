import {MaterialIconNames} from "../../../MaterialIcon/MaterialIcon";

export interface ScrollNavigationDrawerMenuItemData {
  name: ScrollNavigationDrawerMenuItemName;
  icon: MaterialIconNames;
  color: string;
  active: boolean;
}

export enum ScrollNavigationDrawerMenuItemName {
  PICTURE = "Top",
  ABOUT = "About",
  EXPERIENCE = "Experience",
  PROJECTS = "Projects",
  SKILLS = "Skills",
  LANGUAGES = "Languages",
  EDUCATION = "Education",
  CONTACT = "Contact",
  RESUME = "Resume",
}
