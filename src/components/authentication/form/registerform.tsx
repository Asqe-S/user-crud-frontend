import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { toast } from "react-toastify";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";
import { Trole } from "../register";
import { axiosApi, userapi } from "@/components/backend/api";

 type TField = {
  name: "username" | "email" | "password" | "confirm_password";
  type: string;
  label: string;
};

const fields: TField[] = [
  { name: "username", type: "text", label: "Username" },
  { name: "email", type: "email", label: "Email" },
  { name: "password", type: "password", label: "Password" },
  { name: "confirm_password", type: "password", label: "Confirm password" },
];

const usernameRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9_.-]{4,30}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]{4,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9!@#$%^&*()_+=\-[\]{}|\\:;"'<>,.?/~]{8,30}$/;

const RegisterSchema = z
  .object({
    username: z.string().regex(usernameRegex, {
      message: "Please provide a valid username.",
    }),
    email: z.string().regex(emailRegex, {
      message: "Please provide a valid email address.",
    }),
    password: z.string().regex(passwordRegex, {
      message:
        "Invalid password format. It must be 8-30 characters long and include at least one lowercase letter, one uppercase letter, and one digit.",
    }),
    confirm_password: z.string().regex(passwordRegex, {
      message: "Invalid Confirm password",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Oops! Confirm password doesn't match",
    path: ["confirm_password"],
  });

type TRegister = z.infer<typeof RegisterSchema>;

const RegisterForm = ({ role }: Trole) => {
  const navigate = useNavigate();

  const RegisterForm = useForm<TRegister>({
    resolver: zodResolver(RegisterSchema),
    mode: "onChange",
  });

  const submit = async (formData: TRegister) => {
    try {
      const { status } = await axiosApi.post(
       `${ userapi.register}${role}/`,
        formData
      );

      if (status === 201) {
        toast.success(
          "A verification email has been sent. Please check your inbox."
        );
       navigate(`/signin/${role}`);
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
        onSubmit={RegisterForm.handleSubmit(submit)}
        noValidate
        className="space-y-6 mb-3"
      >
        {fields.map((field) => (
          <div className="space-y-2" key={field.name}>
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              type={field.type}
              {...RegisterForm.register(field.name)}
            />

            {RegisterForm.formState.errors[field.name] && (
              <p className="text-red-500 text-xs">
                {RegisterForm.formState.errors[field.name]?.message}
              </p>
            )}
          </div>
        ))}
        <div className="text-center">
          <Button
            disabled={RegisterForm.formState.isSubmitting}
            className="w-1/2"
            type="submit"
          >
            {RegisterForm.formState.isSubmitting ? (
              <>
                <RotateCw className="me-1 h-4 w-4 animate-spin" />
                <span className="animate-pulse">Creating ...</span>
              </>
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </form>
    </>
  );
};

export default RegisterForm;
