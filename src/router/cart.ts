import express from 'express';
import { isAuthenticated } from '../middleware';
import { createCartForUser, getCart } from '../controllers/cart';

export default (router: express.Router) => {
    router.post('/users/:id/cart', isAuthenticated, createCartForUser);
    router.get('/users/:id/cart', isAuthenticated, getCart);
}