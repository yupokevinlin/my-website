import {ScrollNavigationDrawerMenuItemName} from "./ScrollNavigationDrawer/ScrollNavigationDrawerMenuItem/types";

export interface IntersectingElements {
  name: ScrollNavigationDrawerMenuItemName;
  visibility: number;
}

export const initialElementsInView: Array<IntersectingElements> = [
  {
    name: ScrollNavigationDrawerMenuItemName.PICTURE,
    visibility: 1,
  },
  {
    name: ScrollNavigationDrawerMenuItemName.ABOUT,
    visibility: 0,
  },
  {
    name: ScrollNavigationDrawerMenuItemName.EXPERIENCE,
    visibility: 0,
  },
  {
    name: ScrollNavigationDrawerMenuItemName.PROJECTS,
    visibility: 0,
  },
  {
    name: ScrollNavigationDrawerMenuItemName.SKILLS,
    visibility: 0,
  },
  {
    name: ScrollNavigationDrawerMenuItemName.LANGUAGES,
    visibility: 0,
  },
  {
    name: ScrollNavigationDrawerMenuItemName.EDUCATION,
    visibility: 0,
  },
  {
    name: ScrollNavigationDrawerMenuItemName.CONTACT,
    visibility: 0,
  },
];
