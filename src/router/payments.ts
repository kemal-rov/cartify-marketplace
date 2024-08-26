import express from 'express';

import { isAuthenticated } from '../middleware';
import { validatePayment } from '../middleware/payments';
import {
  createPaymentController,
  getUserPaymentsController,
  updatePaymentController,
  deletePaymentController
} from '../controllers/payments';

export default (router: express.Router) => {
  router.post('/payments/create', isAuthenticated, createPaymentController);
  router.get(
    '/payments/:paymentId',
    isAuthenticated,
    getUserPaymentsController,
  );
  router.put('/payments/:paymentId', isAuthenticated, validatePayment, updatePaymentController);
  router.delete('/payments/:paymentId', isAuthenticated, deletePaymentController);
};
