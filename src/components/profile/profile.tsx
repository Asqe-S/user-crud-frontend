import React, { useState } from "react";
import ProfileCard from "./profilecard";
import { Button } from "../ui/button";
import UpdatePassword from "./updatepassword";
import { Tresponse } from "../authentication/resetpassemail";
import { useDispatch, useSelector } from "react-redux";
import { TUserSlice, setUserData } from "../redux/userslice";
import { axiosApi, userapi } from "../backend/api";
import { toast } from "react-toastify";
import ProfilePicture from "./profilepicture";
import DeleteAcc from "./deleteacc";

export type TUpdateUserData = {
  username?: string;
  email?: string;
  profile_picture?: File;
  password?: string;
  confirm_password?: string;
};
export type TState = {
  setState: React.Dispatch<React.SetStateAction<boolean>>;
};

const Profile = () => {
  const [profilePicture, setProfilePicture] = useState(false);
  const [updatePassword, setUpdatePassword] = useState(false);
  const [deleteUser, setDeleteUser] = useState(false);

  const dispatch = useDispatch();
  const userData = useSelector((state: TUserSlice) => state.user.userData);

  const updateUser = async (formData: TUpdateUserData) => {
    try {
      const { data, status }: Tresponse = await axiosApi.patch(
        userapi.userData,

        formData
      );
      if (status === 200) {
        dispatch(setUserData(data));
        toast.success("successfully updated.");
        setUpdatePassword(false);
        setProfilePicture(false);
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
      <ProfileCard setState={setProfilePicture} />
      {userData && (
        <>
          <div className="flex justify-center space-x-3">
            <Button
              onClick={() => setUpdatePassword(!updatePassword)}
              variant="link"
            >
              Update password
            </Button>
            <Button onClick={() => setDeleteUser(!deleteUser)} variant="link">
              Delete account
            </Button>
          </div>
          {updatePassword && (
            <UpdatePassword
              setState={setUpdatePassword}
              updateUser={updateUser}
            />
          )}
          {profilePicture && (
            <ProfilePicture
              setState={setProfilePicture}
              updateUser={updateUser}
            />
          )}
          {deleteUser && <DeleteAcc setState={setDeleteUser} />}
        </>
      )}
    </>
  );
};

export default Profile;
