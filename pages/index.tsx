import type { NextPage } from "next";
import MainPage from "../src/display/pages/MainPage/MainPage";
import {ThemeProvider} from "@material-ui/styles";
import React, {useEffect, useState} from "react";
import {ThemePictureSeason} from "../src/display/components/ThemePicture/types";
import {createStyles, createTheme, Theme} from "@material-ui/core";
import responsiveFontSizes from "@material-ui/core/styles/responsiveFontSizes";
import {makeStyles} from "@material-ui/core/styles";
import smoothScroll from "smoothscroll-polyfill";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    app: {
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      flexWrap: "nowrap",
    },
  }),
);

const Index: NextPage = () => {
  const classes = useStyles();

  useEffect(() => {
    smoothScroll.polyfill();
  }, []);

  const getMaterialUITheme = (season: ThemePictureSeason): Theme => {
    let theme: Theme = null;
    switch (season) {
      case ThemePictureSeason.SPRING: {
        theme = createTheme({
          palette: {
            primary: {
              light: "#77ad5d",
              main: "#569935",
              dark: "#3c6b25",
              contrastText: "#fff",
            },
            secondary: {
              light: "#aaaaaa",
              main: "#666666",
              dark: "#000000",
              contrastText: "#fff",
            }
          },
          typography: {
            fontFamily: `"Roboto", sans-serif`,
          },
        });
        break;
      }
      case ThemePictureSeason.SUMMER: {
        theme = createTheme({
          palette: {
            primary: {
              light: "#455b7e",
              main: "#17325E",
              dark: "#102341",
              contrastText: "#fff",
            },
            secondary: {
              light: "#aaaaaa",
              main: "#666666",
              dark: "#000000",
              contrastText: "#fff",
            }
          },
          typography: {
            fontFamily: `"Roboto", sans-serif`,
          },
        });
        break;
      }
      case ThemePictureSeason.AUTUMN: {
        theme = createTheme({
          palette: {
            primary: {
              light: "#ed8f50",
              main: "#e97325",
              dark: "#a35019",
              contrastText: "#fff",
            },
            secondary: {
              light: "#aaaaaa",
              main: "#666666",
              dark: "#000000",
              contrastText: "#fff",
            }
          },
          typography: {
            fontFamily: `"Roboto", sans-serif`,
          },
        });
        break;
      }
      case ThemePictureSeason.WINTER: {
        theme = createTheme({
          palette: {
            primary: {
              light: "#71a4d2",
              main: "#4e8ec7",
              dark: "#36638b",
              contrastText: "#fff",
            },
            secondary: {
              light: "#aaaaaa",
              main: "#666666",
              dark: "#000000",
              contrastText: "#fff",
            }
          },
          typography: {
            fontFamily: `"Roboto", sans-serif`,
          },
        });
        break;
      }
    }
    theme = responsiveFontSizes(theme);
    return theme;
  };

  const [theme, setTheme] = useState<Theme>(getMaterialUITheme(ThemePictureSeason.WINTER));

  const handleSeasonThemeChange = (season: ThemePictureSeason): void => {
    setTheme(getMaterialUITheme(season));
  };

  return (
    <div className={"root"}>
      <ThemeProvider theme={theme}>
        <div className={classes.app}>
          <MainPage handleSeasonThemeChange={handleSeasonThemeChange}/>
        </div>
      </ThemeProvider>
    </div>
  );
}

export default Index;
