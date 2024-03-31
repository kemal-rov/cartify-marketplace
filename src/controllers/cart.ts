import express from 'express';
import {
  CartModel,
  addItemToCart,
  removeItemFromCart,
  getCartByUserId,
  clearCart,
  updateItemQuantity,
} from '../db/cart';

export const createCartForUser = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const userId = req.params.userId;
    let cart = await getCartByUserId(userId);

    if (cart) {
      return res
        .status(200)
        .json({ message: 'Cart already exists for this user', cart });
    }

    cart = new CartModel({
      user: userId,
      items: [], // Initialize with an empty array of items
    });

    await cart.save();

    return res.status(201).json(cart);
  } catch (error) {
    console.error(`Failed to create cart: ${error}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCart = async (req: express.Request, res: express.Response) => {
  try {
    const userId = req.params.userId;
    const cart = await getCartByUserId(userId);

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    return res.status(200).json(cart);
  } catch (error) {
    console.error(`Failed to retrieve cart: ${error}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const addItemToCartController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { userId } = req.params;
    const { productId, quantity } = req.body;

    const updatedCart = await addItemToCart(userId, productId, quantity);
    res.status(200).json(updatedCart);
  } catch (error) {
    console.error(`Error adding item to cart: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateItemQuantityController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;

    if (typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({
        message: 'Invalid quantity provided. Quantity must be at least 1.',
      });
    }

    const updatedCart = await updateItemQuantity(userId, productId, quantity);
    res.status(200).json(updatedCart);
  } catch (error) {
    console.error(`Error updating item quantity: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const removeItemFromCartController = async (
  req: express.Request,
  res: express.Response,
) => {
  const { userId, productId } = req.params;

  try {
    const updatedCart = await removeItemFromCart(userId, productId);

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error(`Error removing item from cart: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const clearCartController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const userId = req.params.userId;

    await clearCart(userId);
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error(`Error clearing cart: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
};
