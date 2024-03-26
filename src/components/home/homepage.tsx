import { useSelector } from "react-redux";
import { TUserSlice } from "../redux/userslice";



const HomePage = () => {
  const isAuthenticated = useSelector(
    (state: TUserSlice) => state.user.isAuthenticated
  );

  return <>{isAuthenticated ? "signout" : "signin"}</>;
};

export default HomePage;
