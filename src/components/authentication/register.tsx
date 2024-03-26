import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import RegisterForm from "./form/registerform";
import { useEffect } from "react";

export type Trole = {
  role?: string;
};

const Register = () => {
  const { role } = useParams<Trole>();
  const navigate = useNavigate();

  useEffect(() => {
    if (role?.startsWith("mer")) {
      navigate("/register/merchant", { replace: true });
    } else {
      navigate("/register/user", { replace: true });
    }
  }, []);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{role} registration </title>
        </Helmet>
      </HelmetProvider>
      <h2 className="my-10 text-center text-2xl font-bold tracking-tight ">
        Create your {role} account
      </h2>
      <RegisterForm role={role} />
      <p className="text-sm">
        Already have an account?.{"  "}
        <Link
          className="text-blue-800 font-medium underline-offset-4 hover:underline"
          to={`/signin/${role}`}
        >
          Sign In
        </Link>
      </p>
    </>
  );
};

export default Register;
