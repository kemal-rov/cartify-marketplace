import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const OrderItemSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    priceAtPurchase: { type: Number, required: true },
});

const OrderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [OrderItemSchema],
    total: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    paymentMethod: { type: String, enum: ['credit_card', 'paypal', 'stripe', 'cash_on_delivery'], default: 'paypal' },
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        country: String,
        zip: String,
    },
    // myb adding tracking no. and payment details in the future
});

export const Order = model('Order', OrderSchema);

export const declareModule = async (itemId: User, price: number) => {
    console.log(itemId)
}

export const getOrderById = async (orderId: mongoose.Types.ObjectId) => {
    return Order.findById(orderId).populate('items.product');
};

