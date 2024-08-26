import { Request, Response, NextFunction } from 'express';

export const validatePayment = (req: Request, res: Response, next: NextFunction) => {
  const { orderId, method, amount, transactionId, payerId } = req.body;

  // Basic validation checks
  if (!orderId || !method || !amount) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ message: 'Invalid amount.' });
  }

  const validMethods = ['credit_card', 'paypal', 'stripe', 'cash_on_delivery'];
  if (!validMethods.includes(method)) {
    return res.status(400).json({ message: 'Invalid payment method.' });
  }

  // !(WIP)!   Validate transactionId and payerId if provided
  if (transactionId && typeof transactionId !== 'string') {
    return res.status(400).json({ message: 'Invalid transactionId format.' });
  }

  if (payerId && typeof payerId !== 'string') {
    return res.status(400).json({ message: 'Invalid payerId format.' });
  }

  next();
};
