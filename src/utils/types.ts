import mongoose from 'mongoose';
import { OrderStatus, PaymentMethod } from './enums';
import { CookieJar } from 'tough-cookie';

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
  productId: string;
  quantity: number;
}

export interface ICart {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  created_at: Date;
  updated_at: Date;
}

export type ICartResponse = ICart | MessageResponse;

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

// A more restricted user interface for use in requests
export interface IUserWithoutAuth {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  cart: mongoose.Types.ObjectId;
}

export interface IOrderItem {
  product: mongoose.Types.ObjectId | string;
  quantity: number;
  priceAtPurchase: number;
}

export interface IOrder {
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

export interface TestUserSetup {
  userId: string;
  cookieJar: CookieJar;
}

export interface LogoutResponse {
  user: string;
  message: string;
  timestamp: string;
}

export interface DeleteResponse {
  _id: string;
  username: string;
  email: string;
  __v: number;
}

export interface NewProductPayload {
  name: string;
  description: string;
  price: number;
  stock: number;
  categories: string[];
  images: string[];
}

export interface QuantityObject {
  quantity: number;
}

export interface MessageResponse {
  message: string;
}

export interface CartAlreadyExists {
  message: string;
  cart: ICart;
}
