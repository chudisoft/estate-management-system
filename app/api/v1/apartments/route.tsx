import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Apartment } from '@prisma/client';
import { authenticate } from '../auth/auth';

const prisma = new PrismaClient();
const allowedRoles = ['admin', 'user'];

/**
 * @swagger
 * /apartments:
 *   get:
 *     summary: Retrieve a list of apartments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of apartments
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden: Access Denied
 *   post:
 *     summary: Create a new apartment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               cost:
 *                 type: number
 *               costBy:
 *                 type: string
 *               address:
 *                 type: string
 *             required:
 *               - name
 *               - cost
 *               - costBy
 *               - address
 *     responses:
 *       201:
 *         description: Apartment created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden: Access Denied
 *   put:
 *     summary: Update an existing apartment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               cost:
 *                 type: number
 *               costBy:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Apartment updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden: Access Denied
 *   delete:
 *     summary: Delete an apartment
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the apartment to delete
 *     responses:
 *       200:
 *         description: Apartment deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden: Access Denied
 */

export async function GET(request: NextRequest) {
  // const authResult = await authenticate(request, allowedRoles);
  const token = await authenticate(request);
  if (token !== null) return token;
  
  const apartments = await prisma.apartment.findMany();
  return NextResponse.json(apartments);
}

export async function POST(request: NextRequest) {
  const token = await authenticate(request);
  if (token !== null) return token;
  
  const data = await request.json();
  const newApartment = await prisma.apartment.create({
    data,
  });
  return NextResponse.json(newApartment, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const token = await authenticate(request);
  if (token !== null) return token;
  
  const { id, ...data } = await request.json();
  const updatedApartment = await prisma.apartment.update({
    where: { id },
    data,
  });
  return NextResponse.json(updatedApartment);
}

export async function DELETE(request: NextRequest) {
  const token = await authenticate(request);
  if (token !== null) return token;
  
  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get('id') || '');
  const deletedApartment = await prisma.apartment.delete({
    where: { id },
  });
  return NextResponse.json(deletedApartment);
}
