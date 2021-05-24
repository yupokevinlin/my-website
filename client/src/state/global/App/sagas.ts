import {call, put, select, takeEvery, delay} from "redux-saga/effects";
import {
  AppState,
} from "./types";
import {Store} from "../../store";

export const appSagas = {

};

function getAppStateSelector(store: Store): AppState {
  return store.app;
}

export default appSagas;
