"use client"
import React,{useState} from "react";
import {z} from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/axios/axiosConfig";
import { toast } from "@/components/ui/use-toast";

interface FormData {
  email: string;
  password: string;
  status?: boolean;
}

const schema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .nonempty({ message: "Email is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .nonempty({ message: "Password is required" }),
});

export default function Page() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  
 
  const [error , setError] = useState<string>();
  const [formValues, setFormValues] = useState<FormData>({
    email: "",
    password: "",
  });

  const onSubmit = async (data: FormData): Promise<any> => {
    try {
      console.log(data, "the data is here");
      const isValid = await trigger();
      if (isValid) {
        const response = await adminLogin(data);
        console.log(response.dataUser, "the response");

        if (response !== "") {
          if (response?.dataUser !== null) {
            router.push(`/admin/`);
            toast({
              variant: "destructive",
              description: "Login successful",
            });
          } else {
            setError("Invalid username or password");
          }
        } 
      }
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValue(name as keyof FormData, value);
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  return (
    <>
      <div className="flex items-center justify-center  min-h-screen">
        <div className="w-full max-w-md p-8  rounded ">
          <div className="mx-auto mb-4 w-60 h-[100px]  rounded-full overflow-hidden">
          </div>
          <h2 className="text-xl  font-bold text-center">
          Civi Connect
          </h2>
          <h2 className="text-lg    text-center">Admin Sign in</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block  text-sm font-bold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register("email")}
                placeholder="john.doe@example.com"
                className={`border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }  rounded p-3 w-full focus:outline-none focus:ring focus:border-blue-300`}
                onChange={handleInputChange}
                value={formValues.email}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block  text-sm font-bold mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                {...register("password")}
                placeholder="Enter your password"
                className={`border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded p-3 w-full focus:outline-none focus:ring focus:border-blue-300`}
                onChange={handleInputChange}
                value={formValues.password}
              />

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              className="border bg-black text-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-full"
            >
              Continue
            </button>

            <a href="/changePassword" className="text-gray-700 hover:underline">
              Forgotten your password?
            </a>
          </form>

        </div>
      </div>
    </>
  );
}
