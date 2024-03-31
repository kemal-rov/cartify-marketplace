import express from 'express';
import { isAuthenticated } from '../middleware';
import { verifyUserMatch } from '../middleware/users';
import { validateCartOperation } from '../middleware/cart';
import {
  createCartForUser,
  getCart,
  addItemToCartController,
  updateItemQuantityController,
  removeItemFromCartController,
  clearCartController,
} from '../controllers/cart';

export default (router: express.Router) => {
  router.post(
    '/users/:userId/cart',
    isAuthenticated,
    verifyUserMatch,
    createCartForUser,
  );

  router.post(
    '/users/:userId/cart/items',
    isAuthenticated,
    verifyUserMatch,
    validateCartOperation({ checkQuantity: true }),
    addItemToCartController,
  );

  router.get('/users/:userId/cart', isAuthenticated, verifyUserMatch, getCart);

  router.patch(
    '/users/:userId/cart/items/:productId',
    isAuthenticated,
    verifyUserMatch,
    validateCartOperation({ checkQuantity: true, checkItemExists: true }),
    updateItemQuantityController,
  );

  router.delete(
    '/users/:userId/cart/items/:productId',
    isAuthenticated,
    verifyUserMatch,
    validateCartOperation({ checkItemExists: true }),
    removeItemFromCartController,
  );

  router.delete(
    '/users/:userId/cart',
    isAuthenticated,
    verifyUserMatch,
    clearCartController,
  );
};
