import { all } from "redux-saga/effects";
import AppSagas from "./global/App/sagas";

function* rootSaga(): any {
  yield all({
    app: all({
      ...AppSagas,
    }),
  });
}

export default rootSaga;
