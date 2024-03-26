import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { toast } from "react-toastify";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";

import { axiosApi, userapi } from "@/components/backend/api";
import { TVerify } from "../verify";

const otpRegex = /^\d{6}$/;

const VerifyOtpSchema = z.object({
  otp: z.string().regex(otpRegex, {
    message: "Please provide a valid 6-digit OTP.",
  }),
});

type TVerifyOtp = z.infer<typeof VerifyOtpSchema>;
type Tresponse = {
  data: {
    role: string;
    message:string
  };
  status: number;
};

const VerifyOtp = ({ uid, token }: TVerify) => {
  const navigate = useNavigate();

  const VerifyOtpForm = useForm<TVerifyOtp>({
    resolver: zodResolver(VerifyOtpSchema),
    mode: "onChange",
  });

  const submit = async (formData: TVerifyOtp) => {
    try {
      const { status, data }: Tresponse = await axiosApi.post(
        `${userapi.verify}${uid}/${token}/`,
        formData
      );
      if (status === 200) {
        toast.success(data.message);
        navigate(`/signin/${data.role}`, { replace: true });
      }
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
      <form
        onSubmit={VerifyOtpForm.handleSubmit(submit)}
        noValidate
        className="space-y-6 mb-3"
      >
        <div className="space-y-2">
          <Label htmlFor="otp">Enter (OTP)</Label>
          <Input id="otp" type="text" {...VerifyOtpForm.register("otp")} />
          {VerifyOtpForm.formState.errors.otp && (
            <p className="text-red-500 text-xs">
              {VerifyOtpForm.formState.errors.otp.message}
            </p>
          )}
        </div>

        <div className="text-center">
          <Button
            disabled={VerifyOtpForm.formState.isSubmitting}
            className="w-1/2"
            type="submit"
          >
            {VerifyOtpForm.formState.isSubmitting && (
              <RotateCw className="me-1 h-4 w-4 animate-spin" />
            )}
            Verify
          </Button>
        </div>
      </form>
    </>
  );
};

export default VerifyOtp;
