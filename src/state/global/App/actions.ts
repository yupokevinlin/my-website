import {AppActionTypes} from "./types";
export type AppAction = AppInitAction;

export interface AppInitAction {
  type: typeof AppActionTypes.INIT;
}
export const init = (): AppInitAction => {
  return {
    type: AppActionTypes.INIT,
  };
};
