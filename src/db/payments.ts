import mongoose, { Document } from 'mongoose';

interface PaymentDetail {
  method: 'credit_card' | 'paypal' | 'stripe' | 'cash_on_delivery';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  amount: number;
  transactionId?: string; // Optional for tracking payment gateway transaction IDs
  payerId?: string; // Optional for payment methods requiring payer identification
  paymentDate: Date;
}

interface PaymentDocument extends Document, PaymentDetail {
  orderId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
}

const PaymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  method: {
    type: String,
    required: true,
    enum: ['credit_card', 'paypal', 'stripe', 'cash_on_delivery'],
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed', 'refunded'],
  },
  amount: { type: Number, required: true },
  transactionId: { type: String },
  payerId: { type: String },
  paymentDate: { type: Date, default: Date.now },
});

export const Payment = mongoose.model<PaymentDocument>(
  'Payment',
  PaymentSchema,
);

export const getAllPayments = () => Payment.find();
export const getPaymentById = (id: string) => Payment.findById(id);
export const getPaymentsByUserId = (userId: string) =>
  Payment.find({ userId });

export const createPayment = (values: Record<string, any>) =>
  new Payment(values).save();

export const deletePaymentById = (id: string) =>
  Payment.findOneAndDelete({ _id: id });

export const updatePaymentById = (id: string, values: Record<string, any>) =>
  Payment.findByIdAndUpdate(id, values, { new: true });
export const updatePaymentStatus = (paymentId: string, status: string) =>
  Payment.findByIdAndUpdate(paymentId, { status }, { new: true });

export const recordTransactionId = (paymentId: string, transactionId: string) =>
  Payment.findByIdAndUpdate(paymentId, { transactionId }, { new: true });
export const getPaymentByTransactionId = (transactionId: string) =>
  Payment.findOne({ transactionId });
