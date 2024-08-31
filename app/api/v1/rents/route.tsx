import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Rent } from '@prisma/client';
import { authenticate } from '../auth/auth';

const prisma = new PrismaClient();

/**
 * @swagger
 * tags:
 *   - name: Rents
 *     description: Rent management
 *
 * /rents:
 *   get:
 *     tags:
 *       - Rents
 *     summary: Retrieve a list of rents or a specific rent by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         description: ID of the rent to retrieve
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
 *         description: Rent details or a list of rents
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Access Denied
 *       404:
 *         description: Rent not found
 *   post:
 *     tags:
 *       - Rents
 *     summary: Create a new rent
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
 *         description: Rent created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Access Denied
 *   put:
 *     tags:
 *       - Rents
 *     summary: Update an existing rent
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
 *         description: Rent updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Access Denied
 *   delete:
 *     tags:
 *       - Rents
 *     summary: Delete an rent
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the rent to delete
 *     responses:
 *       200:
 *         description: Rent deleted
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
    const rent = await prisma.rent.findUnique({
      where: { id: parseInt(id) },
    });
    
    if (rent) {
      return NextResponse.json(rent);
    } else {
      return NextResponse.json({ message: 'Rent not found' }, { status: 404 });
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
  const rentId = parseInt(searchParams.get('rentId') || '0');
  const totalAmount = parseFloat(searchParams.get('totalAmount') || '0');
  const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : null;
  const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : null;
  
  const where = {
    AND: [
      searchWord ? { tenantId: { contains: searchWord } } : {},
      searchWord ? { name: { contains: searchWord } } : {},
      rentId ? { rentId: { equals: rentId } } : {},
      totalAmount ? { totalAmount: { equals: totalAmount } } : {},
      startDate ? { startDate: { gte: startDate } } : {},
      endDate ? { endDate: { lte: endDate } } : {},
      fromDate ? { createdAt: { gte: fromDate } } : {},
      toDate ? { updatedAt: { lte: toDate } } : {},
    ],
  };

  const rents = await prisma.rent.findMany({
    where,
    orderBy: { [sortBy]: order },
    skip: (page - 1) * limit,
    take: limit,
  });

  const total = await prisma.rent.count({ where });

  return NextResponse.json({
    data: rents,
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
  const newRent = await prisma.rent.create({
    data,
  });
  return NextResponse.json(newRent, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const token = await authenticate(request);
  if (token !== null) return token;
  
  const { id, ...data } = await request.json();
  const updatedRent = await prisma.rent.update({
    where: { id },
    data,
  });
  return NextResponse.json(updatedRent);
}

export async function DELETE(request: NextRequest) {
  const token = await authenticate(request);
  if (token !== null) return token;
  
  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get('id') || '');
  const deletedRent = await prisma.rent.delete({
    where: { id },
  });
  return NextResponse.json(deletedRent);
}
