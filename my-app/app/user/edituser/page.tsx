"use client";
import React, { useState, useEffect } from "react";
import { useAppSelector } from "@/lib/hooks";
import { DialogDemo } from "@/components/editProfiles";
import { useRouter } from "next/navigation";

const EditUserPage = () => {
  const user: any = useAppSelector((state) => state.auth.user);
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);

  const goBack = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <button
        className="absolute mt-20 top-0 left-0 m-4 bg-black border text-white px-4 py-2 rounded-lg z-10"
        onClick={goBack}
      >
        Back
      </button>
      <div className="flex flex-col items-center justify-center w-full">
        <div className="flex space-x-10 justify-center items-center">
          <img
            className="w-32 h-32 p-2 rounded-full mb-4"
            src={userData?.profilePicture}
            alt="Profile"
          />
        </div>

        <h2 className="text-xl font-semibold flex items-center mb-2">
          {userData?.username}
        </h2>

        <div className="text-sm text-gray-500 mb-4">
          <div className="flex p-5 justify-center">
            <div className="mr-6 border-r pr-6">
              <div className="flex items-center">
                <span className="mr-2">Email</span>
              </div>
              <span className="font-bold">{userData?.email}</span>
            </div>
            <div className="mr-6  pr-6">
              <div className="flex items-center">
                <span className="mr-2">Phone</span>
              </div>
              <span className="font-bold">{userData?.phone}</span>
            </div>
          </div>
        </div>
        <button className="bg-black border rounded-lg text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4">
          Edit
          <DialogDemo />
        </button>
      </div>
    </div>
  );
};

export default EditUserPage;
