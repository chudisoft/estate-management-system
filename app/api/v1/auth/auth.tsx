import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function authenticate(
  request: NextRequest,
  allowedRoles: string[] = []
) {
    // const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  //   Check if the user's role is allowed
  const userRole = token.role; // Assuming the role is stored in the token
  if (!allowedRoles.includes(userRole as string)) {
    return NextResponse.json(
      { error: "Forbidden: Access Denied" },
      { status: 403 }
    );
  }

  // Fetch the user's role from the database
  //   const user = await prisma.user.findUnique({
  //     where: { email: token.email as string },
  //     select: { role: true },
  //   });

  //   if (!user || !allowedRoles.includes(user.role)) {
  //     return NextResponse.json({ error: 'Forbidden: Access Denied' }, { status: 403 });
  //   }

  return token; // Return the token if the user is authorized
}

import { comparePassword } from '@/utils/auth'; // Adjust the import path as needed
import { serialize } from 'cookie';
import { sign } from 'jsonwebtoken';


export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    );
  }

  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Generate a JWT or session for the user
    const token = sign(
      { email: user.email, role: user.role }, // Include user details you need in the token
      process.env.JWT_SECRET as string, // Ensure this environment variable is set
      { expiresIn: '1h' } // Token expiry time
    );
    const serializedCookie = serialize('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600, // 1 hour
        path: '/'
    });
    
    const response = NextResponse.json(
        { message: 'Login successful', token  },
        { status: 200 }
    );
    
    response.headers.append('Set-Cookie', serializedCookie);
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Error logging in' },
      { status: 500 }
    );
  }
}
