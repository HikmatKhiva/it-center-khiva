// rootReducer.ts
import { combineReducers } from "@reduxjs/toolkit";
import admin from "./admin";
export const rootReducer = combineReducers({
  admin,
});

export type RootState = ReturnType<typeof rootReducer>;
