import express from 'express';
import { createPayment, getPaymentsByUserId, getPaymentById } from '../db/payments';

export const createPaymentController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { orderId, method, amount, transactionId, payerId } = req.body;
    const userId = (req as any).identity._id;

    const payment = await createPayment({
      orderId,
      userId,
      method,
      status: 'pending',
      amount,
      transactionId,
      payerId,
      paymentDate: new Date(),
    });

    res.status(201).json(payment);
  } catch (error) {
    console.error('Create Payment Error:', error);
    res.status(500).json({ message: 'Failed to create payment.' });
  }
};

export const getUserPaymentsController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const userId = (req as any).identity._id;
    const { paymentId } = req.params;

    if (paymentId) {
      // Fetch a specific payment by ID
      const payment = await getPaymentById(paymentId);
      if (!payment || payment.userId.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'Forbidden: You cannot access this payment.' });
      }
      return res.json(payment);
    } else {
      // Fetch all payments for the current user
      const payments = await getPaymentsByUserId(userId);
      res.json(payments);
    }
  } catch (error) {
    console.error('Get User Payments Error:', error);
    res.status(500).json({ message: 'Failed to retrieve payments.' });
  }
};
