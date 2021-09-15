import {AppState} from "./types";
import {AppAction} from "./actions";

export const initialState: AppState = {

};

export const reducer = (state: AppState = initialState, action: AppAction): AppState => {
  switch (action.type) {
    default:
      return state;
  }
};
