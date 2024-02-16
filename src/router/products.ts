import express from 'express';

import { isAuthenticated } from '../middleware';
import { getProducts, getProductDetails, addProduct } from '../controllers/products';

export default (router: express.Router) => {
    router.get('/products', isAuthenticated, getProducts);
    router.get('/products/:id', isAuthenticated, getProductDetails);
    router.post('/products', isAuthenticated, addProduct);
}