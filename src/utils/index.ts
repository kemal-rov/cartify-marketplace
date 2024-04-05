import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import {
  DeleteResponse,
  IProduct,
  NewProductPayload,
  QuantityObject,
  TestUserSetup,
  ICartItem,
  ICart,
  MessageResponse,
  CartAlreadyExists,
  ICartResponse,
} from './types';
import * as dotenv from 'dotenv';
dotenv.config();

export const axiosInstance = axios.create({ withCredentials: true });
wrapper(axiosInstance);

const url = process.env.BASE_URL_LOCAL;

export const setupTestUser = async (
  email: string,
  username: string,
  password: string,
): Promise<TestUserSetup> => {
  const cookieJar = new CookieJar();
  axiosInstance.defaults.jar = cookieJar;

  await axiosInstance.post(`${url}/auth/register`, {
    email,
    username,
    password,
  });

  const loginResponse = await axiosInstance.post(`${url}/auth/login`, {
    email,
    password,
  });

  const userId = loginResponse.data._id;

  return { userId, cookieJar };
};

export const cleanupTestUser = async (
  userId: string,
  email: string,
  password: string,
): Promise<DeleteResponse> => {
  await axiosInstance.post(`${url}/auth/login`, { email, password });

  const response = await axiosInstance.delete(`${url}/users/${userId}`);
  return response.data as DeleteResponse;
};

export const createProduct = async (
  productData: NewProductPayload,
): Promise<IProduct> => {
  const response = await axiosInstance.post(`${url}/products`, productData);
  return response.data;
};

export const getProduct = async (productId: string) => {
  const response = await axiosInstance.get(`${url}/products/${productId}`);
  return response.data;
};

export const updateProduct = async (
  productId: string,
  updateData: NewProductPayload,
): Promise<IProduct> => {
  const response = await axiosInstance.patch(
    `${url}/products/${productId}`,
    updateData,
  );
  return response.data;
};

export const deleteProduct = async (
  productId: string,
): Promise<MessageResponse> => {
  const response = await axiosInstance.delete(`${url}/products/${productId}`);
  return response.data;
};

export const createCart = async (
  userId: string,
): Promise<ICart | CartAlreadyExists> => {
  const response = await axiosInstance.post(`${url}/users/${userId}/cart`);
  return response.data;
};

export const getCart = async (userId: string): Promise<ICartResponse> => {
  const response = await axiosInstance(`${url}/users/${userId}/cart`);
  return response.data;
};

export const addItemToCart = async (
  userId: string,
  createData: ICartItem,
): Promise<ICart> => {
  const response = await axiosInstance.post(
    `${url}/users/${userId}/cart/items`,
    createData,
  );
  return response.data;
};

export const updateQuantity = async (
  userId: string,
  productId: string,
  updateData: QuantityObject,
): Promise<ICart> => {
  const response = await axiosInstance.patch(
    `${url}/users/${userId}/cart/items/${productId}`,
    updateData,
  );
  return response.data;
};

export const removeCartItem = async (
  userId: string,
  productId: string,
): Promise<ICart> => {
  const response = await axiosInstance.delete(
    `${url}/users/${userId}/cart/items/:${productId}`,
  );
  return response.data;
};

export const clearUserCart = async (
  userId: string,
): Promise<MessageResponse> => {
  const clearedCart = await axiosInstance.delete(`${url}/users/${userId}/cart`);
  return clearedCart.data;
};
