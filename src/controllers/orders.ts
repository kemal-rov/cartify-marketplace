import express from 'express';
import { Order } from '../db/orders';
import { getProductById } from '../db/products';
import { IOrderItem } from '../utils/types';

export const getOrderByIdController = async (req: express.Request, res: express.Response) => {
    try {
        const { orderId } = req.params;
        const userId = (req as any).identity._id;

        const order = await Order.findById(orderId).populate('items.product');

        if (order.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to view this order." });
        }

        return res.status(200).json(order);
    } catch (error) {
        console.error('Failed to retrieve order:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const createOrder = async (req: express.Request, res: express.Response) => {
    try {
        const { userId, items, paymentMethod, shippingAddress } = req.body;
        
        let total = 0;

        const itemsWithPrices = await Promise.all(items.map(async (item: IOrderItem) => {
            const product = await getProductById(item.product.toString());

            if (!product) {
                throw new Error('Product not found');
            }

            const priceAtPurchase = product.price;
            total += priceAtPurchase * item.quantity;

            return { ...item, priceAtPurchase };
        }));

        const newOrder = await Order.create({
            user: userId,
            items: itemsWithPrices,
            total,
            paymentMethod,
            shippingAddress,
            status: 'pending', // Default status
        });

        return res.status(201).json(newOrder);
    } catch (error) {
        console.error('Order creation failed:', error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};