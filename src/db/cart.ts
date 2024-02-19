import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 }
});

const CartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [CartItemSchema],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

export const CartModel = mongoose.model('Cart', CartSchema);

export const getCartByUserId = (userId: string) => CartModel.findOne({ user: userId });

export const addItemToCart = async (userId: string, itemId: string, quantity: number) => {
    const cart = await getCartByUserId(userId) || new CartModel({ user: userId, items: [] });
    const itemIndex = cart.items.findIndex(item => item.product.toString() === itemId);

    if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
    } else {
        cart.items.push({ product: itemId, quantity });
    }

    cart.updated_at = new Date();
    return cart.save();
};
export const removeItemFromCart = async (userId: string, itemId: string) => {
    const cart = await getCartByUserId(userId);
    if (!cart) return;

    cart.items.pull({ product: itemId });
    cart.updated_at = new Date();
    return cart.save();
};
export const clearCart = (userId: string) => CartModel.findOneAndDelete({ user: userId });

export const updateItemQuantity = async (userId: string, itemId: string, newQuantity: number) => {
    const cart = await getCartByUserId(userId);
    if (!cart) throw new Error("Cart not found");

    const item = cart.items.find(item => item._id.toString() === itemId);
    if (!item) throw new Error("Item not found in cart");

    item.quantity = newQuantity;

    cart.markModified('items');
    await cart.save();

    return cart;
};
