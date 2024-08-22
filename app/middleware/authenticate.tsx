import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function authenticate(request: NextRequest, allowedRoles: string[] = []) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token || !token.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: token.email as string },
    select: { role: true },
  });

  if (!user || (allowedRoles.length && !allowedRoles.includes(user.role))) {
    return NextResponse.json({ error: 'Forbidden: Access Denied' }, { status: 403 });
  }

  return NextResponse.next(); // User is authenticated and authorized
}
