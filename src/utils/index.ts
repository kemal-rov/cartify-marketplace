import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import { DeleteResponse, TestUserSetup } from './types';
import * as dotenv from 'dotenv';
dotenv.config();

export const axiosInstance = axios.create({ withCredentials: true });
wrapper(axiosInstance);

const url = process.env.BASE_URL_LOCAL;

export const setupTestUser = async (email: string, username: string, password: string): Promise<TestUserSetup> => {
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

export const cleanupTestUser = async (userId: string, email: string, password: string): Promise<DeleteResponse> => {
  await axiosInstance.post(`${url}/auth/login`, { email, password });

  const response = await axiosInstance.delete(`${url}/users/${userId}`);
  return response.data as DeleteResponse;
};