import { useNavigate, useLocation } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { toast } from "react-toastify";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";
import { axiosApi, userapi } from "@/components/backend/api";

import { passwordRegex } from "./registerform";

import { useDispatch } from "react-redux";
import { loginUser } from "@/components/redux/userslice";
import { Trole } from "../register";

export const combinedRegex =
  /^(?=.*[a-zA-Z])[a-zA-Z0-9_.-]{4,30}$|^[a-zA-Z0-9._%+-]{4,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const SignInSchema = z.object({
  username: z.string().regex(combinedRegex, {
    message: "Please provide a valid username.",
  }),

  password: z.string().regex(passwordRegex, {
    message:
      "Invalid password format. It must be 8-30 characters long and include at least one lowercase letter, one uppercase letter, and one digit.",
  }),
});

type TSignIn = z.infer<typeof SignInSchema>;

export type TField = {
  name: "username" | "password";
  type: string;
  label: string;
};

const fields: TField[] = [
  { name: "username", type: "text", label: "Username or email" },
  { name: "password", type: "password", label: "Password" },
];

type Tresponse = {
  data: {
    pos: boolean;
    notverified: boolean;
    is_blocked: boolean;
    role: string;
    access: string;
    refresh: string;
  };
  status: number;
};

const SignInForm = ({ role }: Trole) => {
  const navigate = useNavigate();

  const location = useLocation();

  const dispatch = useDispatch();

  const SignInForm = useForm<TSignIn>({
    resolver: zodResolver(SignInSchema),
    mode: "onChange",
  });

  const submit = async (formData: TSignIn) => {
    try {
      const { data, status }: Tresponse = await axiosApi.post(
        `${userapi.signin}${role}/`,
        formData
      );

      const roleRedirect = {
        superuser: "/admin",
        merchant: "/merchant",
        default: "/profile",
      };
      if (status === 200) {
        if (data.pos === false) {
          toast.error("You don't have the permission");
        } else if (data.notverified) {
          toast.error(
            "Account not verified. A verification email has been sent to your inbox. Please check."
          );
        } else if (data.is_blocked) {
          toast.error("Your account has been blocked.");
        } else {
          localStorage.setItem("access", data.access);
          localStorage.setItem("refresh", data.refresh);

          dispatch(loginUser());
          const redirectPath =
            roleRedirect[role as keyof typeof roleRedirect] ||
            roleRedirect.default;
          navigate(location.state?.path || redirectPath, { replace: true });
        }
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
        onSubmit={SignInForm.handleSubmit(submit)}
        noValidate
        className="space-y-6 mb-3"
      >
        {fields.map((field) => (
          <div className="space-y-2" key={field.name}>
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              type={field.type}
              {...SignInForm.register(field.name)}
            />

            {SignInForm.formState.errors[field.name] && (
              <p className="text-red-500 text-xs">
                {SignInForm.formState.errors[field.name]?.message}
              </p>
            )}
          </div>
        ))}
        <div className="text-center">
          <Button
            disabled={SignInForm.formState.isSubmitting}
            className="w-1/2"
            type="submit"
          >
            {SignInForm.formState.isSubmitting && (
              <RotateCw className="me-1 h-4 w-4 animate-spin" />
            )}
            Sign In
          </Button>
        </div>
      </form>
    </>
  );
};

export default SignInForm;
