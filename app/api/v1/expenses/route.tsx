// app/api/expenses/route.tsx
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Expense } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @swagger
 * /expenses:
 *   get:
 *     summary: Retrieve a list of expenses
 *     responses:
 *       200:
 *         description: List of expenses
 *   post:
 *     summary: Create a new expense
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *             required:
 *               - amount
 *               - description
 *               - date
 *     responses:
 *       201:
 *         description: Expense created
 *   put:
 *     summary: Update an existing expense
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
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Expense updated
 *   delete:
 *     summary: Delete an expense
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
 */

export async function GET(request: NextRequest) {
  const expenses = await prisma.expense.findMany();
  return NextResponse.json(expenses);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const newExpense = await prisma.expense.create({
    data,
  });
  return NextResponse.json(newExpense, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const { id, ...data } = await request.json();
  const updatedExpense = await prisma.expense.update({
    where: { id },
    data,
  });
  return NextResponse.json(updatedExpense);
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get('id') || '');
  const deletedExpense = await prisma.expense.delete({
    where: { id },
  });
  return NextResponse.json(deletedExpense);
}
