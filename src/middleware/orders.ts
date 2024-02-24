import express from 'express';
import mongoose from 'mongoose';
import { ICartItem, IOrderItem } from '../utils/types'; 
import { getCartByUserId } from '../db/cart';
import { getOrderById } from '../db/orders';

export const attachUserCart = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const userId = (req as any).identity._id;
    
    if (!userId) {
        return res.status(400).json({ message: "User ID is missing." });
    }

    try {
        const cart = await getCartByUserId(userId);
        if (!cart || !cart.items) {
            return res.status(404).json({ message: "Cart not found or empty." });
        }
        (req as any).cart = cart;

        next();
    } catch (error) {
        console.error('Failed to attach user cart:', error);
        return res.status(500).json({ message: "Internal server error while attaching cart." });
    }
};

export const validateOrderAgainstCart = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let orderItems: IOrderItem[];

    if (req.method === "POST") {
        orderItems = req.body.items;

    } else if (req.method === "GET") {
        const orderId = req.params.orderId; // Assuming orderId is in the URL path

        const order = await getOrderById(new mongoose.Types.ObjectId(orderId));

        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        orderItems = order.items;
    }

    const cart = (req as any).cart;

    const cartItemsMap = cart.items.reduce((acc: Record<string, number>, item: ICartItem) => {
        acc[item.product.toString()] = item.quantity;
        return acc;
    }, {});

    const isValidOrder = orderItems.every(item => {
        // Check if product is an object and access _id, else assume it's a string
        const productId = typeof item.product === 'object' ? item.product._id.toString() : item.product;
        
        return cartItemsMap[productId] && cartItemsMap[productId] === item.quantity;
      });
    if (!isValidOrder) {
        return res.status(400).json({ message: "Order items do not match items in the user's cart." });
    }

    next();
};