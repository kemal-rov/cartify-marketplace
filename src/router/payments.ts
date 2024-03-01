import express from 'express';

import { isAuthenticated } from '../middleware';
import { createPaymentController, getUserPaymentsController } from '../controllers/payments';

export default (router: express.Router) => {
    router.post('/payments', isAuthenticated, createPaymentController);
    router.get('/payments/:paymentId', isAuthenticated, getUserPaymentsController)
}