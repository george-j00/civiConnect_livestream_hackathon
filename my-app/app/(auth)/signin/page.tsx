"use client"
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z  } from 'zod';
import { useRouter } from "next/navigation";
import { registerUser } from '@/axios/axiosConfig';
import { FormData } from '@/types/formData';



const schema = z.object({
  email: z.string().email({ message: 'Invalid email address' }).nonempty({ message: 'Email is required' }),
  username: z.string().min(4, { message: 'Username must be at least 4 characters long' }).nonempty({ message: 'Username is required' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }).nonempty({ message: 'Password is required' }),
});


const Page: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const router =  useRouter();
  const [formValues, setFormValues] = useState<FormData>({
    email: '',
    username: '',
    password: '',
  });
  console.log(formValues);


  const onSubmit = async (data: FormData): Promise<any> => {
    try {
      await registerUser(data);
      const queryString = `?email=${data.email.trim()}&username=${data.username?.trim()}&password=${data.password.trim()}`;
      router.push(`/otpauth${queryString}`);
    } catch (error) {
      console.error('Error during form submission:', error);
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
    <div className="flex items-center justify-center bg-white min-h-screen">
      <div className="w-full max-w-md p-8 rounded ">
        <div className="mx-auto mb-4 w-60 h-[100px] rounded-full overflow-hidden">
          <img
            src="/Bae-logos-removebg-preview.png"
            alt="Logo"
            className="w-full h-full object-cover"
          />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register('email')}
              placeholder="john.doe@example.com"
              className={`border ${errors.email ? 'border-red-500' : 'border-gray-300'} text-black rounded p-3 w-full focus:outline-none focus:ring focus:border-blue-300`}
              onChange={handleInputChange}
              value={formValues.email}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              {...register('username')}
              placeholder="Enter your username"
              className={`border ${errors.username ? 'border-red-500' : 'border-gray-300'} text-black rounded p-3 w-full focus:outline-none focus:ring focus:border-blue-300`}
              onChange={handleInputChange}
              value={formValues.username}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-black text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register('password')}
              placeholder="Enter your password"
              className={`border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded p-3 w-full focus:outline-none focus:ring focus:border-blue-300`}
              onChange={handleInputChange}
              value={formValues.password}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-full"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
