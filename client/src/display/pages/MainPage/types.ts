import {
  ScrollNavigationDrawerMenuItemData,
  ScrollNavigationDrawerMenuItemName
} from "../../components/ScrollNavigation/ScrollNavigationDrawer/ScrollNavigationDrawerMenuItem/types";
import {MaterialIconNames} from "../../components/MaterialIcon/MaterialIcon";

export const initialMenuItems: Array<ScrollNavigationDrawerMenuItemData> = [
  {
    name: ScrollNavigationDrawerMenuItemName.ABOUT,
    icon: MaterialIconNames.Person,
    color: "#3f51b5",
    active: false,
  },
  {
    name: ScrollNavigationDrawerMenuItemName.EXPERIENCE,
    icon: MaterialIconNames.TrendingUp,
    color: "#f44336",
    active: false,
  },
  {
    name: ScrollNavigationDrawerMenuItemName.PROJECTS,
    icon: MaterialIconNames.Devices,
    color: "#009688",
    active: false,
  },
  {
    name: ScrollNavigationDrawerMenuItemName.SKILLS,
    icon: MaterialIconNames.BarChart,
    color: "#9c27b0",
    active: false,
  },
  {
    name: ScrollNavigationDrawerMenuItemName.LANGUAGES,
    icon: MaterialIconNames.Language,
    color: "#2196f3",
    active: false,
  },
  {
    name: ScrollNavigationDrawerMenuItemName.EDUCATION,
    icon: MaterialIconNames.School,
    color: "#ff9800",
    active: false,
  },
  {
    name: ScrollNavigationDrawerMenuItemName.CONTACT,
    icon: MaterialIconNames.Mail,
    color: "#795548",
    active: false,
  },
  {
    name: ScrollNavigationDrawerMenuItemName.RESUME,
    icon: MaterialIconNames.Description,
    color: "#757575",
    active: false,
  },
];
