"use client";

import React, {
  useState,
  useRef,
  ChangeEvent,
  KeyboardEvent,
  useEffect,
} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { sendOtp } from "@/axios/axiosConfig";
import { registerUser } from "@/axios/axiosConfig";
interface validateData {
  email: string | null;
  username?: string | null;
  password?: string | null;
}
const Page: React.FC = () => {
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [timer, setTimer] = useState<number>(60);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const username = searchParams.get("username");
  const password = searchParams.get("password");
  const data: validateData = {
    email,
    username,
    password,
  };

  console.log(data, "the resend data");
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [timer]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;

    if (!/^\d*$/.test(value)) {
      setError("Please enter only numeric values.");
      return;
    }

    setCode((prevCode) => {
      const newCode = prevCode.split("");
      newCode[index] = value;
      return newCode.join("");
    });

    if (index < inputRefs.current.length - 1 && value !== "") {
      inputRefs.current[index + 1]?.focus();
    }

    setError(null);
  };

  const onSubmit = async (data: validateData): Promise<any> => {
    try {
      await registerUser(data);
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && index > 0 && !e.currentTarget.value) {
      setCode((prevCode) => {
        const newCode = prevCode.split("");
        newCode[index - 1] = "";
        return newCode.join("");
      });
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      if (email && code && code.length === 4 && /^\d*$/.test(code)) {
        console.log(email);
        const response = await sendOtp(email, +code);
        console.log(response);
        if (response?.data == true) {
          console.log("OTP verification successful. Redirecting...");
          router.push(`/signup`);
        } else {
          setError("OTP verification failed. Please try again.");
        }
      } else {
        setError("Invalid code. Please enter a 4-digit numeric code.");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      setError("OTP verification failed. Please try again.");
    }
  };

  return (
    <>
      <div className="flex items-center justify-center bg-white min-h-screen">
        <div className="w-full max-w-md p-5 rounded shadow-md">
          <div className="mx-auto w-[150px] h-[90px]rounded-full overflow-hidden">
            <img
              src="/Bae-logos-removebg-preview.png"
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center mb-5 text-black">
            <p className="text-[10px]">
              Type the Verification code <br /> That we've sent
            </p>
          </div>
          <div className="flex justify-center space-x-3">
            {Array.from({ length: 4 }, (_, index) => (
              <input
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                type="text"
                value={code[index] || ""}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                maxLength={1}
                className="border border-gray-300 w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 rounded p-4 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            ))}
          </div>
          {error && <p className="text-red-500">{error}</p>}

          <div className="flex justify-center p-5">
            <button
              onClick={handleSubmit}
              className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 "
            >
              Continue
            </button>
          </div>
          <div className="flex justify-center p-5">
            {timer > 0 ? (
              <span className={`text-gray-500`}>Resend in {timer}s</span>
            ) : (
              <a
                className="text-red-500"
                href=""
                onClick={(e) => {
                  e.preventDefault();
                  onSubmit(data);
                }}
              >
                Send Again
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
