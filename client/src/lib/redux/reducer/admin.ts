import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app";
const initialState: InitialStateAdmin = {
  admin: null,
};
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<IAdmin>) => {
      const expirationTime = new Date().getTime() + 3 * 24 * 60 * 60 * 1000; // 3 days from now
      state.admin = { ...action.payload,expirationTime };
      state.admin = { ...action.payload };
      localStorage.removeItem('admin')
      localStorage.setItem("admin", JSON.stringify(state.admin));
    },
    logout: (state) => {
      localStorage.removeItem("admin");
      state.admin = null;
    },
  },
});
export const { login, logout } = adminSlice.actions;
export const select = (state: RootState) => state.admin;
export default adminSlice.reducer;
export const selectUser = (state: RootState) => state.admin.admin;