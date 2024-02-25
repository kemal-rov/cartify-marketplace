import express from 'express';
import { isAuthenticated } from '../middleware';
import { 
    attachUserCart, 
    validateOrderAgainstCart,
    validateOrderUpdate } from '../middleware/orders'
import { 
    createOrder, 
    getOrderByIdController, 
    getUserOrdersController,
    updateOrderStatusToShipped,
    cancelOrderController } from '../controllers/orders';

export default (router: express.Router) => {
    router.get('/orders', isAuthenticated, getUserOrdersController);

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

    router.patch(
        `/orders/:orderId/cancel`,
        isAuthenticated,
        validateOrderUpdate,
        cancelOrderController);

    router.patch(
        `/orders/:orderId/ship`,
        isAuthenticated,
        validateOrderUpdate,
        updateOrderStatusToShipped);
}