import { useDispatch, useSelector } from "react-redux";
import { TUserData, TUserSlice, setUserData } from "../redux/userslice";
import { useEffect } from "react";
import { axiosApi, baseURL, userapi } from "../backend/api";
import { toast } from "react-toastify";
import { Camera, User } from "lucide-react";
import { Button } from "../ui/button";
import { TState } from "./profile";

type Tresponse = {
  data: TUserData;
  status: number;
};
const ProfileCard = ({ setState }: TState) => {
  const dispatch = useDispatch();
  const userData = useSelector((state: TUserSlice) => state.user.userData);

  useEffect(() => {
    const fetcUserData = async () => {
      try {
        const { data, status }: Tresponse = await axiosApi.get(
          userapi.userData
        );
        if (status === 200) {
          dispatch(setUserData(data));
        }
      } catch (error) {
        if ((error as any).response?.data) {
          const errorMessages = Object.values(
            (error as any).response.data
          ).join(" \n");
            console.log("profile", error);
          toast.error(errorMessages);
        } else {
          toast.error(
            "Network Error: Unable to process your request at the moment."
          );
        }
      }
    };
    fetcUserData();
  }, []);
  
  return (
    <>
      {!userData ? (
        <p>loading ... </p>
      ) : (
        <>
          <div className="flex flex-col items-center  space-y-2 mb-3">
            <div className="relative">
              <div className="h-36 w-36 overflow-hidden rounded-full ring-2 ring-offset-2 ring-gray-500">
                {userData.profile_picture ? (
                  <img
                    src={baseURL + userData.profile_picture}
                    className="w-full h-full object-cover"
                    alt="profile picture"
                  />
                ) : (
                  <User className="w-full h-full" />
                )}
              </div>
              <Button
                className="rounded-full size-7  absolute bottom-2 right-1"
                variant="outline"
                size="icon"
                onClick={() => setState(true)}
              >
                <Camera className="size-4" />
              </Button>
            </div>
            <p>{userData.username}</p>
            <p>{userData.email}</p>
          </div>
        </>
      )}
    </>
  );
};

export default ProfileCard;
