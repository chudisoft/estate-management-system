import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Payment } from '@prisma/client';
import { authenticate } from '../auth/auth';

const prisma = new PrismaClient();

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Retrieve a list of payments
 *     responses:
 *       200:
 *         description: List of payments
 *   post:
 *     summary: Create a new payment record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               paymentDate:
 *                 type: string
 *                 format: date
 *               method:
 *                 type: string
 *             required:
 *               - amount
 *               - paymentDate
 *               - method
 *     responses:
 *       201:
 *         description: Payment record created
 *   put:
 *     summary: Update an existing payment record
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
 *               paymentDate:
 *                 type: string
 *                 format: date
 *               method:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment record updated
 *   delete:
 *     summary: Delete a payment record
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the payment record to delete
 *     responses:
 *       200:
 *         description: Payment record deleted
 */

export async function GET(request: NextRequest) {
  const token = await authenticate(request);
  if (token !== null) return token;
  
  const payments = await prisma.payment.findMany();
  return NextResponse.json(payments);
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
