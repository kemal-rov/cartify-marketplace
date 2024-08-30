import express from 'express';
import { Types, Document } from 'mongoose';
import { OrderStatus, PaymentMethod } from './enums';
import { CookieJar } from 'tough-cookie';

export interface IExtendedRequest extends express.Request {
  identity?: IUserDocument; 
  cart?: ICartDocument;
  order?: IOrderDocument;
}

export interface IProduct {
  _id: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  stock: number;
  categories: string[];
  images: string[];
  created_by: Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

export interface ICartItem {
  productId: Types.ObjectId;
  quantity: number;
}

export interface ICart {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  items: ICartItem[];
  created_at: Date;
  updated_at: Date;
}

export type ICartResponse = ICart | MessageResponse;

export interface ICartDocument extends Document<Types.ObjectId>, ICart {}


// Interface representing user authentication details
export interface UserAuthentication {
  password: string;
  salt: string;
  sessionToken: string;
}

// Common fields for user data
interface IUserBase {
  _id: Types.ObjectId;
  username: string;
  email: string;
  cart: Types.ObjectId;
}

// Full user interface including authentication details
export interface IUser extends IUserBase {
  authentication: UserAuthentication;
}

// A more restricted user interface for use in requests
export interface IUserWithoutAuth extends IUserBase {}

// Mongoose document interface with potential for additional methods
export interface IUserDocument extends Document<Types.ObjectId>, IUser {}

export interface IOrderItem {
  product: Types.ObjectId | string;
  quantity: number;
  priceAtPurchase: number;
}

export interface IOrder {
  _id: Types.ObjectId;
  user: Types.ObjectId;
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

export interface IOrderDocument extends Document<Types.ObjectId>, IOrder {}


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
