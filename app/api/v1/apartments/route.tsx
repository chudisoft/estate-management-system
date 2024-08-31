import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Apartment } from '@prisma/client';
import { authenticate } from '../auth/auth';

const prisma = new PrismaClient();
const allowedRoles = ['admin', 'user'];
/**
 * @swagger
 * tags:
 *   - name: Apartments
 *     description: Apartment management
 *
 * /apartments:
 *   get:
 *     tags:
 *       - Apartments
 *     summary: Retrieve a list of apartments or a specific apartment by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         description: ID of the apartment to retrieve
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
 *         description: Apartment details or a list of apartments
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Access Denied
 *       404:
 *         description: Apartment not found
 *   post:
 *     tags:
 *       - Apartments
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
 *         description: Forbidden - Access Denied
 *   put:
 *     tags:
 *       - Apartments
 *     summary: Update an existing apartment
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
 *         description: Apartment updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Access Denied
 *   delete:
 *     tags:
 *       - Apartments
 *     summary: Delete an apartment
 *     security:
 *       - bearerAuth: []
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
 *         description: Forbidden - Access Denied
 */

export async function GET(request: NextRequest) {
  const token = await authenticate(request);
  if (token !== null) return token;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const apartment = await prisma.apartment.findUnique({
      where: { id: parseInt(id) },
    });
    
    if (apartment) {
      return NextResponse.json(apartment);
    } else {
      return NextResponse.json({ message: 'Apartment not found' }, { status: 404 });
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

  const apartments = await prisma.apartment.findMany({
    where,
    orderBy: { [sortBy]: order },
    skip: (page - 1) * limit,
    take: limit,
  });

  const total = await prisma.apartment.count({ where });

  return NextResponse.json({
    data: apartments,
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
