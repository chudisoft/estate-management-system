import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Building } from '@prisma/client';
import { authenticate } from '../auth/auth';

const prisma = new PrismaClient();
/**
 * @swagger
 * tags:
 *   - name: Buildings
 *     description: Building management
 *
 * /buildings:
 *   get:
 *     tags:
 *       - Buildings
 *     summary: Retrieve a list of buildings or a specific building by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         description: ID of the building to retrieve
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number to retrieve
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by (e.g., "name", "cost")
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Order of sorting
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by name
 *       - in: query
 *         name: costMin
 *         schema:
 *           type: number
 *         description: Minimum cost filter
 *     responses:
 *       200:
 *         description: Building details or a list of buildings
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Access Denied
 *       404:
 *         description: Building not found
 *   post:
 *     tags:
 *       - Buildings
 *     summary: Create a new building
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
 *         description: Building created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Access Denied
 *   put:
 *     tags:
 *       - Buildings
 *     summary: Update an existing building
 *     security:
 *       - bearerAuth: []
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
 *         description: Building updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Access Denied
 *   delete:
 *     tags:
 *       - Buildings
 *     summary: Delete an building
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Access Denied
 */

export async function GET(request: NextRequest) {
  const token = await authenticate(request);
  if (token !== null) return token;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const building = await prisma.building.findUnique({
      where: { id: parseInt(id) },
    });
    
    if (building) {
      return NextResponse.json(building);
    } else {
      return NextResponse.json({ message: 'Building not found' }, { status: 404 });
    }
  }

  // Existing code for handling lists, pagination, filtering, and sorting
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const order = searchParams.get('order') || 'asc'; // or 'desc'
  const searchWord = searchParams.get('searchWord');
  const fromDate = searchParams.get('fromDate') ? new Date(searchParams.get('fromDate')!) : null;
  const toDate = searchParams.get('toDate') ? new Date(searchParams.get('toDate')!) : null;
  const costMin = parseFloat(searchParams.get('costMin') || '0');
  const costMax = parseFloat(searchParams.get('costMax') || 'Infinity');

  const where = {
    AND: [
      searchWord ? { name: { contains: searchWord } } : {},
      costMin ? { cost: { gte: costMin } } : {},
      costMax !== Infinity ? { cost: { lte: costMax } } : {},
      fromDate ? { createdAt: { gte: fromDate } } : {},
      toDate ? { updatedAt: { lte: toDate } } : {},
    ],
  };

  const buildings = await prisma.building.findMany({
    where,
    orderBy: { [sortBy]: order },
    skip: (page - 1) * limit,
    take: limit,
  });

  const total = await prisma.building.count({ where });

  return NextResponse.json({
    data: buildings,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
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
