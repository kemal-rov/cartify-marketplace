import express from 'express';
import { isAuthenticated } from '../middleware';
import { getCart } from '../controllers/cart';

export default (router: express.Router) => {
    router.get('/cart', isAuthenticated, getCart);
}