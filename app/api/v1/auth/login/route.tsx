
import { comparePassword } from '@/utils/auth'; // Adjust the import path as needed
import { serialize } from 'cookie';
import { sign } from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  console.log(email, password);
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
