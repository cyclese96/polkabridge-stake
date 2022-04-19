// import { configureStore } from "@reduxjs/toolkit";
// import { save, load } from 'redux-localstorage-simple';
import store from "../store";
// import { updateVersion } from "./global/actions";

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
