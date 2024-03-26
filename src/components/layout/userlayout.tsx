import { useLocation, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { TChildren } from "./authlayout";
import { TToken } from "../backend/api";

const UserLayout = ({ children }: TChildren) => {
  const location = useLocation();

  const access = localStorage.getItem("access");

  try {
    if (!access) {
      throw new Error("no access token");
    }
    const token: TToken = jwtDecode(access);
    if (!token.role) {
      throw new Error("Invalid user role");
    }
  } catch (error) {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    toast.error("Unauthorized access. Please sign in again.");
    return (
      <Navigate
        to="/signin/user"
        state={{ path: location.pathname }}
        replace={true}
      />
    );
  }

  return <>{children}</>;
};

export default UserLayout;
