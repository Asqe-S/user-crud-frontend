import { X } from "lucide-react";
import { Button } from "../ui/button";
import ChangePassword from "../authentication/form/changepassword";
export type Tprops = {
  setState: React.Dispatch<React.SetStateAction<boolean>>;
  updateUser: (formData: any) => void;
};

const UpdatePassword = ({ setState, updateUser }: Tprops) => {
  return (
    <>
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-all backdrop-blur-sm"></div>
      <div className="fixed inset-0 mx-auto my-[3%] space-y-5  max-w-sm  p-4 ">
        <div className="text-end">
          <Button
            className="rounded-full size-7"
            variant="outline"
            size="icon"
            onClick={() => setState(false)}
          >
            <X className="size-4" />
          </Button>
        </div>
        <div className="max-w-xs">
          <ChangePassword onSubmit={updateUser} />
        </div>
      </div>
    </>
  );
};

export default UpdatePassword