import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Building } from '@prisma/client';
import { authenticate } from '../auth/auth';

const prisma = new PrismaClient();

/**
 * @swagger
 * /buildings:
 *   get:
 *     summary: Retrieve a list of buildings
 *     responses:
 *       200:
 *         description: List of buildings
 *   post:
 *     summary: Create a new building
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
 *         description: Building created
 *   put:
 *     summary: Update an existing building
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
 *         description: Building updated
 *   delete:
 *     summary: Delete a building
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the building to delete
 *     responses:
 *       200:
 *         description: Building deleted
 */

export async function GET(request: NextRequest) {
  const token = await authenticate(request);
  if (token !== null) return token;
  
  const buildings = await prisma.building.findMany();
  return NextResponse.json(buildings);
}

export async function POST(request: NextRequest) {
  const token = await authenticate(request);
  if (token !== null) return token;
  
  const data = await request.json();
  const newBuilding = await prisma.building.create({
    data,
  });
  return NextResponse.json(newBuilding, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const token = await authenticate(request);
  if (token !== null) return token;
  
  const { id, ...data } = await request.json();
  const updatedBuilding = await prisma.building.update({
    where: { id },
    data,
  });
  return NextResponse.json(updatedBuilding);
}

export async function DELETE(request: NextRequest) {
  const token = await authenticate(request);
  if (token !== null) return token;
  
  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get('id') || '');
  const deletedBuilding = await prisma.building.delete({
    where: { id },
  });
  return NextResponse.json(deletedBuilding);
}
