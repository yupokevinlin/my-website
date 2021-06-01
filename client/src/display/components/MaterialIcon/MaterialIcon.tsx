import React from "react";
import {SvgIconProps} from "@material-ui/core";

import Inbox from "@material-ui/icons/Inbox";
import Mail from "@material-ui/icons/Mail";
import Home from "@material-ui/icons/Home";
import Settings from "@material-ui/icons/Settings";
import LocalShipping from "@material-ui/icons/LocalShipping";
import Image from "@material-ui/icons/Image";
import Description from "@material-ui/icons/Description";
import Build from "@material-ui/icons/Build";
import InsertDriveFile from "@material-ui/icons/InsertDriveFile";
import Memory from "@material-ui/icons/Memory";
import SupervisorAccount from "@material-ui/icons/SupervisorAccount";
import Notifications from "@material-ui/icons/Notifications";
import Menu from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Report from "@material-ui/icons/Report";
import DesktopWindows from "@material-ui/icons/DesktopWindows"
import Dashboard from "@material-ui/icons/Dashboard";
import Event from "@material-ui/icons/Event";
import Palette from "@material-ui/icons/Palette";
import LocalGroceryStore from "@material-ui/icons/LocalGroceryStore";
import Close from "@material-ui/icons/Close";
import CheckBoxOutlineBlank from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBox from "@material-ui/icons/CheckBox";
import ExitToApp from "@material-ui/icons/ExitToApp";
import Map from "@material-ui/icons/Map";
import Redo from "@material-ui/icons/Redo";
import SystemUpdateAlt from "@material-ui/icons/SystemUpdateAlt";
import Storage from "@material-ui/icons/Storage";
import PlayCircleOutline from "@material-ui/icons/PlayCircleOutline";
import Widgets from "@material-ui/icons/Widgets";
import AccessTime from "@material-ui/icons/AccessTime";
import Extension from "@material-ui/icons/Extension";
import AccountBalance from "@material-ui/icons/AccountBalance";
import PriorityHigh from "@material-ui/icons/PriorityHigh";
import PhoneIphone from "@material-ui/icons/PhoneIphone";
import SpeakerNotes from "@material-ui/icons/SpeakerNotes";
import VpnKey from "@material-ui/icons/VpnKey";
import ShowChart from "@material-ui/icons/ShowChart";
import BarChart from "@material-ui/icons/BarChart";
import NavigateNext from "@material-ui/icons/NavigateNext";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Stop from "@material-ui/icons/Stop";
import PlayArrow from "@material-ui/icons/PlayArrow";
import LocalHospital from "@material-ui/icons/LocalHospital";
import AssignmentTurnedIn from "@material-ui/icons/AssignmentTurnedIn";
import Language from "@material-ui/icons/Language";
import Add from "@material-ui/icons/Add";
import Remove from "@material-ui/icons/Remove";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Info from "@material-ui/icons/Info";

import {SkullIcon as Skull} from "./SvgIcon/SvgIcons"

export interface MaterialIconProps extends SvgIconProps {
  iconName: MaterialIconNames;
}

export enum MaterialIconNames {
  AccessTime = "AccessTime",
  AccountBalance = "AccountBalance",
  AccountCircle = "AccountCircle",
  Add = "Add",
  AssignmentTurnedIn = "AssignmentTurnedIn",
  BarChart = "BarChart",
  Build = "Build",
  CheckBox = "CheckBox",
  CheckBoxOutlineBlank = "CheckBoxOutlineBlank",
  ChevronLeft = "ChevronLeft",
  ChevronRight = "ChevronRight",
  Close = "Close",
  Dashboard = "Dashboard",
  Description = "Description",
  DesktopWindows = "DesktopWindows",
  Event = "Event",
  ExitToApp = "ExitToApp",
  Extension = "Extension",
  FirstPage = "FirstPage",
  Home = "Home",
  Image = "Image",
  Inbox = "Inbox",
  Info = "Info",
  InsertDriveFile = "InsertDriveFile",
  Language = "Language",
  LastPage = "LastPage",
  LocalGroceryStore = "LocalGroceryStore",
  LocalHospital = "LocalHospital",
  LocalShipping = "LocalShipping",
  Mail = "Mail",
  Map = "Map",
  Memory = "Memory",
  Menu = "Menu",
  NavigateNext = "NavigateNext",
  Notifications = "Notifications",
  Palette = "Palette",
  PhoneIphone = "PhoneIphone",
  PlayArrow = "PlayArrow",
  PlayCircleOutline = "PlayCircleOutline",
  PriorityHigh = "PriorityHigh",
  Redo = "Redo",
  Remove = "Remove",
  Report = "Report",
  Settings = "Settings",
  Shift = "Shift",
  Skull = "Skull",
  ShowChart = "ShowChart",
  SpeakerNotes = "SpeakerNotes",
  Stop = "Stop",
  Storage = "Storage",
  SupervisorAccount = "SupervisorAccount",
  SystemUpdateAlt = "SystemUpdateAlt",
  VpnKey = "VpnKey",
  Widgets = "Widgets",
}

const MaterialIcon: React.FC<MaterialIconProps> = (props) => {
  const copiedProps: MaterialIconProps = { ...props };
  delete copiedProps.iconName;
  const svgIconProps: SvgIconProps = { ...copiedProps };
  switch (props.iconName) {
    case MaterialIconNames.AccessTime: {
      return <AccessTime {...svgIconProps}/>;
    }
    case MaterialIconNames.AccountBalance: {
      return <AccountBalance {...svgIconProps}/>;
    }
    case MaterialIconNames.AccountCircle: {
      return <AccountCircle {...svgIconProps}/>;
    }
    case MaterialIconNames.Add: {
      return <Add {...svgIconProps}/>;
    }
    case MaterialIconNames.AssignmentTurnedIn: {
      return <AssignmentTurnedIn {...svgIconProps}/>;
    }
    case MaterialIconNames.BarChart: {
      return <BarChart {...svgIconProps}/>;
    }
    case MaterialIconNames.Build: {
      return <Build {...svgIconProps}/>;
    }
    case MaterialIconNames.CheckBox: {
      return <CheckBox {...svgIconProps}/>;
    }
    case MaterialIconNames.CheckBoxOutlineBlank: {
      return <CheckBoxOutlineBlank {...svgIconProps}/>;
    }
    case MaterialIconNames.ChevronLeft: {
      return <ChevronLeft {...svgIconProps}/>;
    }
    case MaterialIconNames.ChevronRight: {
      return <ChevronRight {...svgIconProps}/>;
    }
    case MaterialIconNames.Close: {
      return <Close {...svgIconProps}/>;
    }
    case MaterialIconNames.Dashboard: {
      return <Dashboard {...svgIconProps}/>;
    }
    case MaterialIconNames.Description: {
      return <Description {...svgIconProps}/>;
    }
    case MaterialIconNames.DesktopWindows: {
      return <DesktopWindows {...svgIconProps}/>;
    }
    case MaterialIconNames.Event: {
      return <Event {...svgIconProps}/>;
    }
    case MaterialIconNames.ExitToApp: {
      return <ExitToApp {...svgIconProps}/>;
    }
    case MaterialIconNames.Extension: {
      return <Extension {...svgIconProps}/>;
    }
    case MaterialIconNames.FirstPage: {
      return <FirstPage {...svgIconProps}/>;
    }
    case MaterialIconNames.Home: {
      return <Home {...svgIconProps}/>;
    }
    case MaterialIconNames.Image: {
      return <Image {...svgIconProps}/>;
    }
    case MaterialIconNames.Inbox: {
      return <Inbox {...svgIconProps}/>;
    }
    case MaterialIconNames.Info: {
      return <Info {...svgIconProps}/>;
    }
    case MaterialIconNames.InsertDriveFile: {
      return <InsertDriveFile {...svgIconProps}/>;
    }
    case MaterialIconNames.Language: {
      return <Language {...svgIconProps}/>;
    }
    case MaterialIconNames.LastPage: {
      return <LastPage {...svgIconProps}/>;
    }
    case MaterialIconNames.LocalGroceryStore: {
      return <LocalGroceryStore {...svgIconProps}/>;
    }
    case MaterialIconNames.LocalHospital: {
      return <LocalHospital {...svgIconProps}/>;
    }
    case MaterialIconNames.LocalShipping: {
      return <LocalShipping {...svgIconProps}/>;
    }
    case MaterialIconNames.Mail: {
      return <Mail {...svgIconProps}/>;
    }
    case MaterialIconNames.Map: {
      return <Map {...svgIconProps}/>;
    }
    case MaterialIconNames.Memory: {
      return <Memory {...svgIconProps}/>;
    }
    case MaterialIconNames.Menu: {
      return <Menu {...svgIconProps}/>;
    }
    case MaterialIconNames.NavigateNext: {
      return <NavigateNext {...svgIconProps}/>;
    }
    case MaterialIconNames.Notifications: {
      return <Notifications {...svgIconProps}/>;
    }
    case MaterialIconNames.Palette: {
      return <Palette {...svgIconProps}/>;
    }
    case MaterialIconNames.PhoneIphone: {
      return <PhoneIphone {...svgIconProps}/>;
    }
    case MaterialIconNames.PlayArrow: {
      return <PlayArrow {...svgIconProps}/>;
    }
    case MaterialIconNames.PlayCircleOutline: {
      return <PlayCircleOutline {...svgIconProps}/>;
    }
    case MaterialIconNames.PriorityHigh: {
      return <PriorityHigh {...svgIconProps}/>;
    }
    case MaterialIconNames.Redo: {
      return <Redo {...svgIconProps}/>;
    }
    case MaterialIconNames.Remove: {
      return <Remove {...svgIconProps}/>;
    }
    case MaterialIconNames.Report: {
      return <Report {...svgIconProps}/>;
    }
    case MaterialIconNames.Settings: {
      return <Settings {...svgIconProps}/>;
    }
    case MaterialIconNames.SpeakerNotes: {
      return <SpeakerNotes {...svgIconProps}/>;
    }
    case MaterialIconNames.Stop: {
      return <Stop {...svgIconProps}/>;
    }
    case MaterialIconNames.Skull: {
      return <Skull {...svgIconProps}/>;
    }
    case MaterialIconNames.ShowChart: {
      return <ShowChart {...svgIconProps}/>;
    }
    case MaterialIconNames.Storage: {
      return <Storage {...svgIconProps}/>;
    }
    case MaterialIconNames.SupervisorAccount: {
      return <SupervisorAccount {...svgIconProps}/>;
    }
    case MaterialIconNames.SystemUpdateAlt: {
      return <SystemUpdateAlt {...svgIconProps}/>;
    }
    case MaterialIconNames.VpnKey: {
      return <VpnKey {...svgIconProps}/>;
    }
    case MaterialIconNames.Widgets: {
      return <Widgets {...svgIconProps}/>;
    }
  }
};

export default MaterialIcon;
