import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Expense } from '@prisma/client';
import { authenticate } from '../auth/auth';

const prisma = new PrismaClient();

/**
 * @swagger
 * tags:
 *   - name: Expenses
 *     description: Expense management
 *
 * /expenses:
 *   get:
 *     tags:
 *       - Expenses
 *     summary: Retrieve a list of expenses or a specific expense by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         description: ID of the expense to retrieve
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
 *         description: Expense details or a list of expenses
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Access Denied
 *       404:
 *         description: Expense not found
 *   post:
 *     tags:
 *       - Expenses
 *     summary: Create a new expense
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
 *         description: Expense created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Access Denied
 *   put:
 *     tags:
 *       - Expenses
 *     summary: Update an existing expense
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
 *         description: Expense updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Access Denied
 *   delete:
 *     tags:
 *       - Expenses
 *     summary: Delete an expense
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the expense to delete
 *     responses:
 *       200:
 *         description: Expense deleted
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
    const expense = await prisma.expense.findUnique({
      where: { id: parseInt(id) },
    });
    
    if (expense) {
      return NextResponse.json(expense);
    } else {
      return NextResponse.json({ message: 'Expense not found' }, { status: 404 });
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
  const amount = parseFloat(searchParams.get('amount') || '0');
  const buildingId = parseInt(searchParams.get('buildingId') || '0');
  const expenseId = parseInt(searchParams.get('expenseId') || '0');

  const where = {
    AND: [
      searchWord ? { name: { contains: searchWord } } : {},
      searchWord ? { description: { contains: searchWord } } : {},
      searchWord ? { category: { contains: searchWord } } : {},
      amount ? { amount: { equals: amount } } : {},
      buildingId ? {buildingId : { equals: buildingId } } : {},
      expenseId ? {expenseId : { equals: expenseId } } : {},
      fromDate ? { createdAt: { gte: fromDate } } : {},
      toDate ? { updatedAt: { lte: toDate } } : {},
    ],
  };

  const expenses = await prisma.expense.findMany({
    where,
    orderBy: { [sortBy]: order },
    skip: (page - 1) * limit,
    take: limit,
  });

  const total = await prisma.expense.count({ where });

  return NextResponse.json({
    data: expenses,
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
  const newExpense = await prisma.expense.create({
    data,
  });
  return NextResponse.json(newExpense, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const token = await authenticate(request);
  if (token !== null) return token;
  
  const { id, ...data } = await request.json();
  const updatedExpense = await prisma.expense.update({
    where: { id },
    data,
  });
  return NextResponse.json(updatedExpense);
}

export async function DELETE(request: NextRequest) {
  const token = await authenticate(request);
  if (token !== null) return token;
  
  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get('id') || '');
  const deletedExpense = await prisma.expense.delete({
    where: { id },
  });
  return NextResponse.json(deletedExpense);
}
