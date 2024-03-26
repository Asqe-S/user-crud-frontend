import { Check, Pen, RotateCw, User, X } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { useSelector } from "react-redux";
import { TUserSlice } from "../redux/userslice";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import { baseURL } from "../backend/api";
import { Tprops } from "./updatepassword";

const ProfilePicture = ({ setState, updateUser }: Tprops) => {
  const [picture, setPicture] = useState<File | null>(null);
  const [submit, setSubmit] = useState(false);
  const userData = useSelector((state: TUserSlice) => state.user.userData);

  return (
    <>
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-all backdrop-blur-sm"></div>
      <div className="fixed inset-0 mx-auto my-[3%] space-y-5  max-w-sm  p-4 ">
        <div className="flex justify-end space-x-2">
          {!submit && (
            <>
              <Label
                className="border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-full size-7  flex justify-center items-center cursor-pointer"
                htmlFor="profile_picture"
              >
                <Pen className="size-4" />
              </Label>
              <Input
                className="hidden"
                id="profile_picture"
                type="file"
                accept="image/*"
                onChange={(e) => setPicture(e.target.files?.[0] || null)}
              />
            </>
          )}

          {picture && (
            <Button
              disabled={submit}
              className="rounded-full size-7"
              variant="outline"
              size="icon"
              onClick={() => {
                const formData = new FormData();
                formData.append("profile_picture", picture);
                setSubmit(true);
                updateUser(formData);
              }}
            >
              {submit ? (
                <RotateCw className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}
            </Button>
          )}
          <Button
            className="rounded-full size-7"
            variant="outline"
            size="icon"
            onClick={() => setState(false)}
          >
            <X className="size-4" />
          </Button>
        </div>
        <div className="rounded-lg overflow-hidden">
          {picture ? (
            <img src={URL.createObjectURL(picture)} alt="profile picture" />
          ) : userData?.profile_picture ? (
            <img
              src={baseURL + userData?.profile_picture}
              className="w-full h-full object-cover"
              alt="profile picture"
            />
          ) : (
            <User className="w-full h-full" />
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePicture;
