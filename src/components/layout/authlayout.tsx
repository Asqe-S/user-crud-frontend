import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { TToken } from "../backend/api";

export type TChildren = {
  children: ReactNode;
};

const AuthLayout = ({ children }: TChildren) => {
  const access = localStorage.getItem("access");

  if (access) {
    try {
      const token: TToken = jwtDecode(access);
      if (token.role === "superuser") {
        return <Navigate to="/admin" replace={true} />;
      } else if (token.role === "merchant") {
        return <Navigate to="/merchant" replace={true} />;
      } else if (token.role === "user") {
        return <Navigate to="/profile" replace={true} />;
      }
    } catch (error) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    }
  }

  return <div className="max-w-sm mx-auto">{children}</div>;
};

export default AuthLayout;
