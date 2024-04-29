import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from "jose";


export const middleware = async (req: NextRequest) => {
  const token = req.cookies.get('Jwt_login_token')?.value
  if (!token) {
    return NextResponse.redirect(new URL('/signup', req.url))
  }
  try {
  const hasVerifiedToken : any = token && await jwtVerify(token, new TextEncoder().encode("secret_key"));
    if (hasVerifiedToken) {
      return NextResponse.next();
    }
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.redirect(new URL('/signup', req.url))
  }
};


export const config = {
    matcher: ["/"],
}