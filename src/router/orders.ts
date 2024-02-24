import express from 'express';
import { isAuthenticated } from '../middleware';
import { attachUserCart, validateOrderAgainstCart } from '../middleware/orders'
import { createOrder, getOrderByIdController } from '../controllers/orders';

export default (router: express.Router) => {
    router.get(
        '/orders/:orderId', 
        isAuthenticated, 
        attachUserCart, 
        validateOrderAgainstCart, 
        getOrderByIdController);

    router.post(
        '/orders/create', 
        isAuthenticated, 
        attachUserCart, 
        validateOrderAgainstCart, 
        createOrder);
}