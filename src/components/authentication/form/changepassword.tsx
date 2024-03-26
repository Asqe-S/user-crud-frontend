import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RotateCw } from "lucide-react";
import { passwordRegex } from "./registerform";

const ChangePasswordSchema = z
  .object({
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

export type TChangePasswordSchema = z.infer<typeof ChangePasswordSchema>;

export type ChangePasswordProps = {
  onSubmit: (data: TChangePasswordSchema) => void;
};

type TField = {
  name: "password" | "confirm_password";
  type: string;
  label: string;
};

const fields: TField[] = [
  { name: "password", type: "password", label: "Password" },
  { name: "confirm_password", type: "password", label: "Confirm password" },
];

const ChangePassword = ({ onSubmit }: ChangePasswordProps) => {
  const ChangePasswordForm = useForm<TChangePasswordSchema>({
    resolver: zodResolver(ChangePasswordSchema),
    mode: "onChange",
  });

  const handleSubmit = async (data: TChangePasswordSchema) => {
    await onSubmit(data);
  };

  return (
    <>
      <form
        onSubmit={ChangePasswordForm.handleSubmit(handleSubmit)}
        noValidate
        className="space-y-6 mb-3"
      >
        {fields.map((field) => (
          <div className="space-y-2" key={field.name}>
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              type={field.type}
              {...ChangePasswordForm.register(field.name)}
            />

            {ChangePasswordForm.formState.errors[field.name] && (
              <p className="text-red-500 text-xs">
                {ChangePasswordForm.formState.errors[field.name]?.message}
              </p>
            )}
          </div>
        ))}
        <div className="text-center">
          <Button
            disabled={ChangePasswordForm.formState.isSubmitting}
            className="w-1/2"
            type="submit"
          >
            {ChangePasswordForm.formState.isSubmitting && (
              <RotateCw className="me-1 h-4 w-4 animate-spin" />
            )}
            Change Password
          </Button>
        </div>
      </form>
    </>
  );
};

export default ChangePassword;
