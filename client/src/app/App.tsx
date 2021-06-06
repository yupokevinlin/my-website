import React, {useEffect} from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {Provider} from "react-redux";
import {configureStore} from "../state/store";
import {makeStyles} from "@material-ui/core/styles";
import MainPage from "../display/pages/MainPage/MainPage";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import responsiveFontSizes from "@material-ui/core/styles/responsiveFontSizes";
import {ThemeProvider} from "@material-ui/styles";
import smoothScroll from "smoothscroll-polyfill";

export type AppProps = AppDataProps & AppStyleProps & AppEventProps;

export interface AppDataProps {

}

export interface AppStyleProps {

}

export interface AppEventProps {

}

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

export namespace AppStore {
  const getInitialMaterialUITheme = (): Theme => {
    let theme = createMuiTheme({
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
    theme = responsiveFontSizes(theme);
    return theme;
  };

  export const store = configureStore();
  export const theme: Theme = getInitialMaterialUITheme();
}

const App: React.FC<AppProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  useEffect(() => {
    smoothScroll.polyfill();
  }, []);

  const {

  } = props;

  return (
    <Provider store={AppStore.store}>
      <ThemeProvider theme={AppStore.theme}>
        <div className={classes.app}>
          <MainPage/>
        </div>
      </ThemeProvider>
    </Provider>
  );
};

export default App;

