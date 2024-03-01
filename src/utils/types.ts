import mongoose from 'mongoose';
import { OrderStatus, PaymentMethod } from './enums';

  export interface IProduct {
    _id: mongoose.Types.ObjectId;
    name: string;
    description: string;
    price: number;
    stock: number;
    categories: string[];
    images: string[];
    created_by: mongoose.Types.ObjectId;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface ICartItem {
    product: mongoose.Types.ObjectId;
    quantity: number;
  }
  
  export interface ICart {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    items: ICartItem[];
    created_at: Date;
    updated_at: Date;
  }
  
  export interface IUser {
    _id: mongoose.Types.ObjectId;
    username: string;
    email: string;
    authentication: {
      password: string;
      salt: string;
      sessionToken: string;
    };
    cart: mongoose.Types.ObjectId;
  }
  
  export interface IOrderItem {
    product: mongoose.Types.ObjectId | string;
    quantity: number;
    priceAtPurchase: number;
  }
  
 export  interface IOrder {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    items: IOrderItem[];
    total: number;
    status: OrderStatus;
    createdAt: Date;
    paymentMethod: PaymentMethod;
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      country: string;
      zip: string;
    };
  }