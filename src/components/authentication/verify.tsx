import { useEffect, useState } from "react";
import {  useNavigate, useParams } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";

import VerifyOtp from "./form/verifyotpform";
import { Button } from "../ui/button";
import { RotateCw } from "lucide-react";
import { axiosApi, userapi } from "../backend/api";
import { toast } from "react-toastify";

export type TVerify = { uid?: string; token?: string };

export const checkLink = async (
  uid: string | undefined,
  token: string | undefined,
  navigate: ReturnType<typeof useNavigate>
) => {
  try {
    await axiosApi.get(`${userapi.verify}${uid}/${token}/`);
  } catch (error) {
    if ((error as any).response?.data) {
      const errorMessages = Object.values((error as any).response.data).join(
        " \n"
      );
      toast.error(errorMessages);
      navigate("/", { replace: true });
    } else {
      toast.error(
        "Network Error: Unable to process your request at the moment."
      );
    }
  }
};

const Verify = () => {
  const { uid, token } = useParams<TVerify>();
  const [resend, setResend] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkLink(uid, token, navigate);
  }, []);

  const ResendOtp = async () => {
    setResend(true);
    try {
      const { data } = await axiosApi.get(
        `${userapi.resendotp}${uid}/${token}/`
      );

      toast.success(data.message);
      setResend(false);
    } catch (error) {
      if ((error as any).response?.data) {
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
          <title>verify account</title>
        </Helmet>
      </HelmetProvider>
      <h2 className="my-10 text-center text-2xl font-bold tracking-tight ">
        Verify your account
      </h2>
      <VerifyOtp uid={uid} token={token} />
      <Button disabled={resend} variant="link" onClick={ResendOtp}>
        {resend ? (
          <>
            <RotateCw className="me-1 h-4 w-4 animate-spin" />
            <span className="animate-pulse">Resending Otp ...</span>
          </>
        ) : (
          " Resend Otp"
        )}
      </Button>
    </>
  );
};

export default Verify;
