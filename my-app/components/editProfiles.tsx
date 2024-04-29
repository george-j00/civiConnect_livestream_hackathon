import { useState } from "react";
import { Button } from "@/components/ui/button";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { editUserProfile } from "@/axios/axiosConfig";
import { useAppSelector } from "@/lib/hooks";
import { useAppDispatch } from "@/lib/hooks";
import { updateProfile } from "@/lib/actions/features/auth.slice";

interface Profile {
  username: string;
  email: string;
  phone: number;
  profilePicture: string;
}

export function DialogDemo() {
   
      
        const dispatch = useAppDispatch();
        const user: any = useAppSelector((state) => state.auth.user);
        const [editedProfile, setEditedProfile] = useState<Profile>({

          username: user?.username || "",
          email: user?.email || "",
          phone: user?.phone,
          profilePicture: user?.profilePicture || "",
        });
        const [currentStep, setCurrentStep] = useState<number>(0);
        const totalSteps = 2;
      
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const { name, value } = e.target;
          setEditedProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
          }));
        };
      
        const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          const file = event.target.files?.[0];
          if (file) {
            setEditedProfile((prevProfile  : any) => ({
              ...prevProfile,
              profilePicture: URL.createObjectURL(file),
              uploadPic: file,
            }));
          }
        };
      
        const handleNextStep = () => {
          setCurrentStep((prevStep) => prevStep + 1);
        };
      
        const handlePreviousStep = () => {
          setCurrentStep((prevStep) => prevStep - 1);
        };
      
        const handleSaveChanges = async () => {
          console.log("Saving changes", editedProfile);
          if (
            !editedProfile.username ||
            !editedProfile.email ||
            !editedProfile.profilePicture ||
            !editedProfile.username ||
            !editedProfile.phone
          ) {
            toast({
              description: "Please fill in all required fields.",
            });
            return;
          }
          try {
            const userId = user._id;
            console.log(userId);
            const result: any = await editUserProfile(userId, JSON.parse(JSON.stringify(editedProfile)));
            dispatch(updateProfile(result.dataUser));
      
            toast({
              description: "User Data Updated successfully",
            });
          } catch (error) {
            console.error("Error during form submission:", error);
          }
        };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <EditOutlinedIcon />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription className="flex justify-center items-center">
            <Avatar className="w-16 h-16">
              <AvatarImage src={editedProfile.profilePicture} alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {currentStep === 0 && (
            <div>
              <div className="grid grid-cols-4 py-2 items-center gap-6">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  value={editedProfile.username}
                  onChange={handleChange}
                  className="col-span-3 p-2"
                />
              </div>
              <div className="grid grid-cols-4 py-2 items-center gap-6">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={editedProfile.phone}
                  onChange={handleChange}
                  className="col-span-3 p-2"
                />
              </div>
            </div>
          )}
          {currentStep === 1 && (
            <div>
              <div className="grid grid-cols-4 py-2 items-center gap-6">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  value={editedProfile.email}
                  onChange={handleChange}
                  className="col-span-3 p-2"
                />
              </div>
              <div className="grid grid-cols-4 py-2 items-center gap-6">
                <Label htmlFor="profilePicture" className="text-right">
                  Profile Picture
                </Label>
                <Input
                  id="profilePicture"
                  name="profilePicture"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="col-span-3 p-2"
                />
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="flex  justify-center">
          {currentStep > 0 && (
            <Button className="bg-black border" onClick={handlePreviousStep}>
              <ArrowBackIcon /> Back
            </Button>
          )}
          {currentStep < totalSteps - 1 && (
            <Button className="bg-black border" onClick={handleNextStep}>
              Next
            </Button>
          )}
          {currentStep === totalSteps - 1 && (
            <Button className="mb-4 bg-black" onClick={handleSaveChanges}>
              Save changes
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
