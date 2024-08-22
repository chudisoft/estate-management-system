import { PrismaClient, User } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '../auth/auth';
import { hashPassword } from '@/utils/auth';
import { error } from 'console';

const prisma = new PrismaClient();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     responses:
 *       200:
 *         description: List of users
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User created
 *   put:
 *     summary: Update an existing user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 *   delete:
 *     summary: Delete a user
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted
 */

export async function GET(request: NextRequest) {
  const token = await authenticate(request);
  if (token !== null) return token;
  
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const token = await authenticate(request);
  if (token !== null) return token;
  
  const data = await request.json();

  if (!data.email || !data.password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  try {
    data.role = data.role || 'user'; // Assign role
    data.password = await hashPassword(data.password); // Implement hashPassword function

    const newUser = await prisma.user.create({
      data,
    });
    return NextResponse.json({ user: newUser, message: 'User registered successfully' }, { status: 201 });

  } catch (error) {
    console.log(error);
    
    return NextResponse.json({ error: 'Error registering user' }, { status: 500 });
  }

}

export async function PUT(request: NextRequest) {
  const token = await authenticate(request);
  if (token !== null) return token;
  
  const { id, ...data } = await request.json();
  const updatedUser = await prisma.user.update({
    where: { id },
    data,
  });
  return NextResponse.json(updatedUser);
}

export async function DELETE(request: NextRequest) {
  const token = await authenticate(request);
  if (token !== null) return token;
  
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id') || '';
  const deletedUser = await prisma.user.delete({
    where: { id },
  });
  return NextResponse.json(deletedUser);
}
