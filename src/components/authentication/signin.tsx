import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";

import { Trole } from "./register";
import { useEffect } from "react";
import SignInForm from "./form/signinform";

const SignIn = () => {
  const { role } = useParams<Trole>();

  const navigate = useNavigate();

  useEffect(() => {
    if (role?.startsWith("superuser")) {
      navigate("/signin/superuser", { replace: true });
    } else if (role?.startsWith("mer")) {
      navigate("/signin/merchant", { replace: true });
    } else {
      navigate("/signin/user", { replace: true });
    }
  }, []);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{role} sign in </title>
        </Helmet>
      </HelmetProvider>

      <h2 className="my-10 text-center text-2xl font-bold tracking-tight ">
        Sign in to your {role} account
      </h2>
      <SignInForm role={role} />
      <div className="flex text-sm justify-between">
        {role !== "superuser" && (
          <p className="">
            Don't have an account?.{" "}
            <Link
              className="text-blue-800 font-medium underline-offset-4 hover:underline"
              to={`/register/${role}`}
            >
              Register
            </Link>
          </p>
        )}
        <Link
          className="text-blue-800 font-medium  underline-offset-4 hover:underline"
          to={"/forgot-password"}
        >
          forgot password?.
        </Link>
      </div>
    </>
  );
};

export default SignIn;
