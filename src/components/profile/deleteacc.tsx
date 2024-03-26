import { Button } from "../ui/button";
import { TState } from "./profile";
import { useState } from "react";
import { Input } from "../ui/input";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { axiosApi, userapi } from "../backend/api";
import { logoutUser } from "../redux/userslice";
import { RotateCw } from "lucide-react";

const DeleteAcc = ({ setState }: TState) => {
  const [inputText, setInputText] = useState("");
  const [submit, setSubmit] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const deleteUserData = async () => {
    setSubmit(true);
    try {
      const { status } = await axiosApi.delete(userapi.userData);
      if (status === 204) {
        toast.success("Your account has been successfully deleted.");
        navigate("/", { replace: true });
        dispatch(logoutUser());
        setState(false);
      }
    } catch (error) {
      if ((error as any).response?.data) {
        const errorMessages = Object.values((error as any).response.data).join(
          " \n"
        );
        console.log("profile", error);
        toast.error(errorMessages);
      } else {
        toast.error(
          "Network Error: Unable to process your request at the moment."
        );
      }
    }
    setSubmit(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-all backdrop-blur-sm"></div>
      <div className="fixed inset-0 mx-auto my-[3%] space-y-5  max-w-sm  p-4 ">
        <div className="max-w-xs">
          <h1 className="uppercase font-medium text-red-500 text-lg text-center">
            Account delete
          </h1>
          <p className="text-justify">
            Are you sure you want to proceed?
            <br />
            This action cannot be undone. It will permanently delete your
            account and remove all associated data from our servers.
            <br />
            To confirm, please type{" "}
            <span className="text-red-500 font-medium">
              DELETE ACCOUNT
            </span>{" "}
            below:
          </p>
          <Input
            className="border-0 rounded-none mb-3 border-b border-b-slate-200 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-center"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <div className="space-x-2 flex">
            <Button className="w-1/2" onClick={() => setState(false)}>
              Cancel
            </Button>
            <Button
              disabled={inputText !== "DELETE ACCOUNT" || submit}
              className={` ${
                inputText !== "DELETE ACCOUNT" || submit
                  ? "bg-red-300 text-gray-500"
                  : "bg-red-500"
              } w-1/2`}
              onClick={() => deleteUserData()}
            >
              {submit ? (
                <>
                  <RotateCw className="me-1 h-4 w-4 animate-spin" />
                  <span className="animate-pulse">Deleting ...</span>
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteAcc;
