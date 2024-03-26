import { useNavigate, useParams } from "react-router-dom";

import { Helmet, HelmetProvider } from "react-helmet-async";
import ChangePassword, { TChangePasswordSchema } from "./form/changepassword";

import { axiosApi, userapi } from "@/components/backend/api";
import { toast } from "react-toastify";
import { TVerify } from "./verify";
import { useEffect } from "react";
import { Tresponse } from "./resetpassemail";

const ResetPassword = () => {
  const { uid, token } = useParams<TVerify>();

  const navigate = useNavigate();

  useEffect(() => {
    const checkLink = async () => {
      try {
        await axiosApi.get(`${userapi.forgotpassword}${uid}/${token}/`);
      } catch (error) {
        if ((error as any).response?.data) {
          const errorMessages = Object.values(
            (error as any).response.data
          ).join(" \n");
          toast.error(errorMessages);
          navigate("/forgot-password", { replace: true });
        } else {
          toast.error(
            "Network Error: Unable to process your request at the moment."
          );
        }
      }
    };
    checkLink();
  }, []);

  const submit = async (formData: TChangePasswordSchema) => {
    try {
      const { data, status }: Tresponse = await axiosApi.post(
        `${userapi.forgotpassword}${uid}/${token}/`,
        formData
      );

      if (status === 200) {
        toast.success("Password has changed successfully");
        navigate(`/signin/${data.pos}`, { replace: true });
      }
    } catch (error) {
      if ((error as any).response?.data) {
        navigate("/forgot-password", { replace: true });
        const errorMessages = Object.values((error as any).response.data).join(
          " \n"
        );
        toast.error(errorMessages);
      } else {
        toast.error(
          "Network Error: Unable to process your request at the moment."
        );
      }
    }
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>reset password</title>
        </Helmet>
      </HelmetProvider>
      <h2 className="my-10  text-center text-2xl font-bold tracking-tight ">
        Reset your password
      </h2>
      <ChangePassword onSubmit={submit} />
    </>
  );
};

export default ResetPassword;
