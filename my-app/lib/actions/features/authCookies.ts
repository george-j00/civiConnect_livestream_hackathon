'use server'
import { cookies } from 'next/headers'

export const setCookie = async (token:string) => {
    cookies().set({
        name: 'Jwt_login_token',
        value:token,
        httpOnly: true,
        path: '/',
        expires: new Date(Date.now() + 15 * 60 * 1000),
      })
}

export const deleteCookie = async () => {
  cookies().delete('Jwt_login_token')
}

export const getCookie = async () => {
  const token =  cookies().get('Jwt_login_token')?.value
  return token;
}