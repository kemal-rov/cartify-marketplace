import express from 'express';
import { getUserBySessionToken } from '../db/users';
import { 
    CartModel, 
    addItemToCart, 
    removeItemFromCart, 
    getCartByUserId, 
    clearCart, 
    updateItemQuantity } from '../db/cart';

export const getCart = async (req: express.Request, res: express.Response) => {
    try {
        const sessionToken = req.cookies.AUTH_TOKEN; // Or wherever you store the token
        if (!sessionToken) {
            return res.status(401).json({ message: "No session token provided" });
        }
    
        const user = await getUserBySessionToken(sessionToken);
        if (!user) {
            return res.status(401).json({ message: "Invalid session token" });
        }

        const cart = await getCartByUserId(user._id.toString());

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        return res.status(200).json(cart);
    } catch (error) {
        console.error(`Failed to retrieve cart: ${error}`);
        return res.status(500).json({ message: "Internal server error" });
    }
};