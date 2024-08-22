// app/api/apartments/route.tsx
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Apartment } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @swagger
 * /apartments:
 *   get:
 *     summary: Retrieve a list of apartments
 *     responses:
 *       200:
 *         description: List of apartments
 *   post:
 *     summary: Create a new apartment
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
 */

export async function GET(request: NextRequest) {
  const apartments = await prisma.apartment.findMany();
  return NextResponse.json(apartments);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const newApartment = await prisma.apartment.create({
    data,
  });
  return NextResponse.json(newApartment, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const { id, ...data } = await request.json();
  const updatedApartment = await prisma.apartment.update({
    where: { id },
    data,
  });
  return NextResponse.json(updatedApartment);
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get('id') || '');
  const deletedApartment = await prisma.apartment.delete({
    where: { id },
  });
  return NextResponse.json(deletedApartment);
}
