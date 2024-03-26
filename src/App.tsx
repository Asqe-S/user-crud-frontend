import { Route, Routes } from "react-router-dom";
import Register from "./components/authentication/register";
import AuthLayout from "./components/layout/authlayout";
import Verify from "@/components/authentication/verify";
import HomePage from "./components/home/homepage";
import SignIn from "./components/authentication/signin";
import ResetPassEmail from "./components/authentication/resetpassemail";
import ResetPassword from "./components/authentication/resetpassword";
import Profile from "./components/profile/profile";
import UserLayout from "./components/layout/userlayout";
import Wishlist from "./components/wishlist/wishlist";
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="signin/:role"
          element={
            <AuthLayout>
              <SignIn />
            </AuthLayout>
          }
        />
        <Route
          path="register/:role"
          element={
            <AuthLayout>
              <Register />
            </AuthLayout>
          }
        />
        <Route
          path="verify/:uid/:token"
          element={
            <AuthLayout>
              <Verify />
            </AuthLayout>
          }
        />
        <Route
          path="forgot-password"
          element={
            <AuthLayout>
              <ResetPassEmail />
            </AuthLayout>
          }
        />
        <Route
          path="reset-password/:uid/:token"
          element={
            <AuthLayout>
              <ResetPassword />
            </AuthLayout>
          }
        />
        <Route
          path="profile"
          element={
            <UserLayout>
              <Profile />
            </UserLayout>
          }
        />
        <Route
          path="wishlist"
          element={
            <UserLayout>
              <Wishlist />
            </UserLayout>
          }
        />



      </Routes>
    </>
  );
};

export default App;

