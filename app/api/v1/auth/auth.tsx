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
