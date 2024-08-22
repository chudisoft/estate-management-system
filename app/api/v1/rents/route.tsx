// app/api/rent/route.tsx
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Rent } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @swagger
 * /rent:
 *   get:
 *     summary: Retrieve a list of rents
 *     responses:
 *       200:
 *         description: List of rents
 *   post:
 *     summary: Create a new rent record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               paymentBatch:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     amount:
 *                       type: number
 *                     date:
 *                       type: string
 *                       format: date
 *             required:
 *               - amount
 *               - paymentBatch
 *     responses:
 *       201:
 *         description: Rent record created
 *   put:
 *     summary: Update an existing rent record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               amount:
 *                 type: number
 *               paymentBatch:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     amount:
 *                       type: number
 *                     date:
 *                       type: string
 *                       format: date
 *     responses:
 *       200:
 *         description: Rent record updated
 *   delete:
 *     summary: Delete a rent record
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the rent record to delete
 *     responses:
 *       200:
 *         description: Rent record deleted
 */

export async function GET(request: NextRequest) {
  const rents = await prisma.rent.findMany();
  return NextResponse.json(rents);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const newRent = await prisma.rent.create({
    data,
  });
  return NextResponse.json(newRent, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const { id, ...data } = await request.json();
  const updatedRent = await prisma.rent.update({
    where: { id },
    data,
  });
  return NextResponse.json(updatedRent);
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get('id') || '');
  const deletedRent = await prisma.rent.delete({
    where: { id },
  });
  return NextResponse.json(deletedRent);
}
