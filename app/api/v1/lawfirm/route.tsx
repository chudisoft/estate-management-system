import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, LawFirm } from '@prisma/client';
import { authenticate } from '../auth/auth';

const prisma = new PrismaClient();

/**
 * @swagger
 * /lawfirms:
 *   get:
 *     summary: Retrieve a list of lawfirms
 *     responses:
 *       200:
 *         description: List of lawfirms
 *   post:
 *     summary: Create a new lawfirm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               numOfFloors:
 *                 type: integer
 *             required:
 *               - name
 *               - address
 *               - numOfFloors
 *     responses:
 *       201:
 *         description: LawFirm created
 *   put:
 *     summary: Update an existing lawfirm
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
 *               address:
 *                 type: string
 *               numOfFloors:
 *                 type: integer
 *     responses:
 *       200:
 *         description: LawFirm updated
 *   delete:
 *     summary: Delete a lawfirm
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the lawfirm to delete
 *     responses:
 *       200:
 *         description: LawFirm deleted
 */

export async function GET(request: NextRequest) {
  const token = await authenticate(request);
  if (token !== null) return token;
  
  const lawfirms = await prisma.lawFirm.findMany();
  return NextResponse.json(lawfirms);
}

export async function POST(request: NextRequest) {
  const token = await authenticate(request);
  if (token !== null) return token;
  
  const data = await request.json();
  const newLawFirm = await prisma.lawFirm.create({
    data,
  });
  return NextResponse.json(newLawFirm, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const token = await authenticate(request);
  if (token !== null) return token;
  
  const { id, ...data } = await request.json();
  const updatedLawFirm = await prisma.lawFirm.update({
    where: { id },
    data,
  });
  return NextResponse.json(updatedLawFirm);
}

export async function DELETE(request: NextRequest) {
  const token = await authenticate(request);
  if (token !== null) return token;
  
  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get('id') || '');
  const deletedLawFirm = await prisma.lawFirm.delete({
    where: { id },
  });
  return NextResponse.json(deletedLawFirm);
}
