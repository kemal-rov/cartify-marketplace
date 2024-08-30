import express from 'express';
import { getCartByUserId } from '../db/cart';
import { IExtendedRequest } from 'utils/types';

export const validateCartOperation =
  ({ checkQuantity = false, checkItemExists = false } = {}) =>
  async (
    req: IExtendedRequest,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const { userId, productId } = req.params;
    const { quantity } = req.body;

    // Validate quantity if required
    if (checkQuantity && (!quantity || quantity < 1)) {
      return res.status(400).json({
        message: 'Invalid quantity provided. Quantity must be at least 1.',
      });
    }
    // Always check for cart existence
    const cart = await getCartByUserId(userId);

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    // Check if the item exists in the cart if required
    if (checkItemExists && productId) {
      const itemExists = cart.items.some(
        (item) => item.productId.toString() === productId,
      );

      if (!itemExists) {
        return res.status(404).json({ message: 'Item not found in cart.' });
      }
    }

    (req as any).cart = cart;
    next();
  };
