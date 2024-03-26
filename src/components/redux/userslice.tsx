import { createSlice } from "@reduxjs/toolkit";

export type TUserData = {
  username: string;
  email: string;
  profile_picture: File;
};

export type TIsAuth = boolean;
export type TUserSlice = {
  user: {
    isAuthenticated: TIsAuth;
    userData: TUserData | null;
  };
};

const initialState = {
  isAuthenticated: localStorage.getItem("access") ? true : false,
  userData: "",
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser(state) {
      state.isAuthenticated = true;
    },
    logoutUser(state) {
      state.isAuthenticated = false;
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    },
    setUserData(state, action) {
      state.userData = action.payload;
    },
  },
});

export const { loginUser, logoutUser, setUserData } = userSlice.actions;
export default userSlice.reducer;
