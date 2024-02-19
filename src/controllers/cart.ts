import express from 'express';
import { 
    CartModel, 
    addItemToCart, 
    removeItemFromCart, 
    getCartByUserId, 
    clearCart, 
    updateItemQuantity } from '../db/cart';

    export const createCartForUser = async (req: express.Request, res: express.Response) => {
        try {
            const userId = (req as any).identity?._id.toString();
    
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized - user id is missing." }).end();
            }
    
            let cart = await getCartByUserId(userId);
            if (cart) {
                return res.status(200).json({ message: 'Cart already exists for this user', cart }).end();
            }
    
            cart = new CartModel({
                user: userId,
                items: [] // Initialize with an empty array of items
            });
    
            await cart.save();
    
            return res.status(201).json(cart).end();
        } catch (error) {
            console.error(`Failed to create cart: ${error}`);
            return res.status(500).json({ message: "Internal server error" });
        }
    };

export const getCart = async (req: express.Request, res: express.Response) => {
    try {    
        // Directly asserting the type of req to any to access custom properties
        const userId = (req as any).identity?._id.toString();
        console.log(userId);

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized - no userId." }).end();
        }

        // Assuming getCartByUserId is a function that retrieves the cart based on userId
        const cart = await getCartByUserId(userId);

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' }).end();
        }

        return res.status(200).json(cart).end();
    } catch (error) {
        console.error(`Failed to retrieve cart: ${error}`);
        return res.status(500).json({ message: "Internal server error" });
    }
};