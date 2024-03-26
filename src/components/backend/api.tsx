import axios from "axios";
import { jwtDecode } from "jwt-decode";
export const baseURL = "http://127.0.0.1:8000/";

export const axiosApi = axios.create({
  baseURL,
});

export const userapi = {
  register: "auth/register/",
  signin: "auth/login/",
  verify: "auth/verify-otp/",
  resendotp: "auth/resend-otp/",
  forgotpassuser: "auth/forgot-password-user/",
  forgotpassword: "auth/forgot-password/",

  userData: "user-data/",
};

const TOKEN_EXPIRY_THRESHOLD = 3 * 60 * 1000;

const refreshAccessToken = async (refreshToken: string) => {
  try {
    const response = await axios.post(`${baseURL}auth/refresh/`, {
      refresh: refreshToken,
    });
    const { access, refresh } = response.data;
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    return access;
  } catch (error) {
    console.log("api", (error as any).response);

    // console.error("Error refreshing access token:", (error as any)?.message);
    // throw new Error("Failed to refresh access token");
  }
};

export type TToken = {
  exp: number;
  user_id: number;
  role: string;
  user: string;
};

const removeToken = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};

axiosApi.interceptors.request.use(async (config) => {
  const access = localStorage.getItem("access");

  if (!access) {
    return config;
  }

  try {
    const decodedAccessToken: TToken = jwtDecode(access);

    if (!decodedAccessToken.user) {
      return config;
    }

    const currentTime = new Date().getTime();
    const expiryTime = decodedAccessToken.exp * 1000 - TOKEN_EXPIRY_THRESHOLD;

    if (currentTime >= expiryTime) {
      console.log("Token expired. Refreshing...");

      const refresh = localStorage.getItem("refresh");
      if (!refresh) {
        return config;
      }
      const decodedRefreshToken: TToken = jwtDecode(refresh);

      if (
        !decodedRefreshToken.user ||
        decodedAccessToken.user !== decodedRefreshToken.user
      ) {
        return config;
      }

      const refreshExpirationTime = decodedRefreshToken.exp * 1000;

      if (currentTime >= refreshExpirationTime) {
        removeToken();
        return config;
      }

      const newAccessToken = await refreshAccessToken(refresh);
      config.headers.Authorization = `Bearer ${newAccessToken}`;
    } else {
      config.headers.Authorization = `Bearer ${access}`;
    }

    return config;
  } catch (error) {
    // removeToken();
    // console.error("Error processing request:", (error as any).message);
    return Promise.reject(error);
  }
});

