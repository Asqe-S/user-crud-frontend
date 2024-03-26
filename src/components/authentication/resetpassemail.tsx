import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";

import { Helmet, HelmetProvider } from "react-helmet-async";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { axiosApi, userapi } from "@/components/backend/api";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";

import { combinedRegex } from "./form/signinform";


const ResetPasEmailSchema = z.object({
  username: z.string().regex(combinedRegex, {
    message: "Please provide a valid username.",
  }),
});

type TResetPassEmail = z.infer<typeof ResetPasEmailSchema>;

export type Tresponse = {
  data: {
    pos: string;
  };
  status: number;
};

const ResetPassEmail = () => {
  const navigate = useNavigate();

  const ResetPassForm = useForm<TResetPassEmail>({
    resolver: zodResolver(ResetPasEmailSchema),
    mode: "onChange",
  });

  const submit = async (formData: TResetPassEmail) => {
    try {
      const { data, status }: Tresponse = await axiosApi.post(
        userapi.forgotpassuser,
        formData
      );
        console.log(data)
      if (status === 200) {
        toast.success(
          "Password reset email has been sent. Please check your inbox."
        );
        navigate(`/signin/${data.pos}`,{replace:true});
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
      <HelmetProvider>
        <Helmet>
          <title>reset password email confirmation</title>
        </Helmet>
      </HelmetProvider>
      <h2 className="my-10  text-center text-2xl font-bold tracking-tight ">
        Reset your password
      </h2>
      <form
        onSubmit={ResetPassForm.handleSubmit(submit)}
        noValidate
        className="space-y-6 mb-3"
      >
        <div className="space-y-2">
          <Label htmlFor="username">Username or email</Label>
          <Input
            id="username"
            type="text"
            {...ResetPassForm.register("username")}
          />
          {ResetPassForm.formState.errors.username && (
            <p className="text-red-500 text-xs">
              {ResetPassForm.formState.errors.username.message}
            </p>
          )}
        </div>
        <div className="text-center">
          <Button
            disabled={ResetPassForm.formState.isSubmitting}
            className="w-1/2"
            type="submit"
          >
            {ResetPassForm.formState.isSubmitting ? (
              <>
                <RotateCw className="me-1 h-4 w-4 animate-spin" />
                <span className="animate-pulse">Sending Link ...</span>
              </>
            ) : (
              "Send Link"
            )}
          </Button>
        </div>
      </form>
    </>
  );
};

export default ResetPassEmail;
