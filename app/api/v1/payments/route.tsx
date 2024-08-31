import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Payment } from '@prisma/client';
import { authenticate } from '../auth/auth';

const prisma = new PrismaClient();

/**
 * @swagger
 * tags:
 *   - name: Payments
 *     description: Payment management
 *
 * /payments:
 *   get:
 *     tags:
 *       - Payments
 *     summary: Retrieve a list of payments or a specific payment by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         description: ID of the payment to retrieve
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
 *         description: Payment details or a list of payments
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Access Denied
 *       404:
 *         description: Payment not found
 *   post:
 *     tags:
 *       - Payments
 *     summary: Create a new payment
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
 *         description: Payment created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Access Denied
 *   put:
 *     tags:
 *       - Payments
 *     summary: Update an existing payment
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
 *         description: Payment updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Access Denied
 *   delete:
 *     tags:
 *       - Payments
 *     summary: Delete an payment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the payment to delete
 *     responses:
 *       200:
 *         description: Payment deleted
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
    const payment = await prisma.payment.findUnique({
      where: { id: parseInt(id) },
    });
    
    if (payment) {
      return NextResponse.json(payment);
    } else {
      return NextResponse.json({ message: 'Payment not found' }, { status: 404 });
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
  const amountPaid = parseFloat(searchParams.get('amountPaid') || '0');
  const rentId = parseInt(searchParams.get('rentId') || '0');

  const where = {
    AND: [
      searchWord ? { tenantId: { contains: searchWord } } : {},
      searchWord ? { paymentId: { contains: searchWord } } : {},
      searchWord ? { accountPaidTo: { contains: searchWord } } : {},
      searchWord ? { comment: { contains: searchWord } } : {},
      amountPaid ? { amountPaid: { equals: amountPaid } } : {},
      rentId ? { rentId: { equals: rentId } } : {},
      fromDate ? { createdAt: { gte: fromDate } } : {},
      toDate ? { updatedAt: { lte: toDate } } : {},
    ],
  };

  const payments = await prisma.payment.findMany({
    where,
    orderBy: { [sortBy]: order },
    skip: (page - 1) * limit,
    take: limit,
  });

  const total = await prisma.payment.count({ where });

  return NextResponse.json({
    data: payments,
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
  const newPayment = await prisma.payment.create({
    data,
  });
  return NextResponse.json(newPayment, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const token = await authenticate(request);
  if (token !== null) return token;
  
  const { id, ...data } = await request.json();
  const updatedPayment = await prisma.payment.update({
    where: { id },
    data,
  });
  return NextResponse.json(updatedPayment);
}

export async function DELETE(request: NextRequest) {
  const token = await authenticate(request);
  if (token !== null) return token;
  
  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get('id') || '');
  const deletedPayment = await prisma.payment.delete({
    where: { id },
  });
  return NextResponse.json(deletedPayment);
}
