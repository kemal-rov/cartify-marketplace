import axios from 'axios';
import { email, username, password } from '../utils/data.json';
import { generateUniqueEmail, generateUniqueUsername } from '../helpers/dataGenerator';
import * as dotenv from 'dotenv';
dotenv.config();

import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

// Wrap Axios instance with axios-cookiejar-support
wrapper(axios);

// Create a new cookie jar for an axios instance
const cookieJar = new CookieJar();

// Create an axios instance with cookie jar support
const axiosInstance = axios.create({
  withCredentials: true,
});

// Attach the cookie jar to the axios instance
axiosInstance.defaults.jar = cookieJar;

describe('Authentication Tests', () => {
  const url = process.env.BASE_URL_LOCAL;
  let userId: string;
  const newEmail = generateUniqueEmail(email);
  const newUsername = generateUniqueUsername(username);

  beforeAll(async () => {
    // Create a new user
    const response = await axiosInstance.post(`${url}/auth/register`, {
      email: newEmail,
      password: password,
      username: newUsername,
    });

    userId = response.data._id;

    expect(response.status).toBe(200);
    expect(response.data.email).toBe(newEmail);
  });

  afterAll(async () => {
    // First, log in as that user
    const loginResponse = await axiosInstance.post(`${url}/auth/login`, {
      email: newEmail,
      password: password,
    });

    // Then, delete the user
    const deletedUser = await axiosInstance.delete(`${url}/users/${userId}`);

    expect(deletedUser.data).not.toHaveProperty('authentication');
  });

  it('should reject duplicate user registration', async () => {
    try {
      await axiosInstance.post(`${url}/auth/register`, {
        email: newEmail,
        password: password,
        username: newUsername,
      });
      fail('Expected duplicate registration to fail with 400 status code');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        expect(error.response?.status).toBe(400);
      } else {
        throw error; // If it's not an AxiosError
      }
    }
  });

  it('should reject login with incorrect password', async () => {
    try {
      await axiosInstance.post(`${url}/auth/login`, {
        email: newEmail,
        password: 'wrongpassword',
      });
      fail('Expected login with incorrect password to fail');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        expect(error.response?.status).toBe(403);
        expect(error.response?.data).not.toHaveProperty('email');
      } else {
        throw error;
      }
    }
  });

  it('should reject registration with missing fields', async () => {
    try {
      await axiosInstance.post(`${url}/auth/register`, {
        email: newEmail,
        // password is missing
        username: newUsername,
      });
      fail('Expected registration with missing fields to fail');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        expect(error.response?.status).toBe(400);
      } else {
        throw error;
      }
    }
  });

  it('should login the user with correct credentials', async () => {
    const loginResponse = await axiosInstance.post(`${url}/auth/login`, {
      email: newEmail,
      password: password,
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.data).toHaveProperty('email', newEmail);
  });

  it('should logout the user', async () => {
    // Ensure there's a session to logout from by logging in first
    await axiosInstance.post(`${url}/auth/login`, {
      email: newEmail,
      password: password,
    });

    const logoutResponse = await axiosInstance.post(`${url}/auth/logout`);
    expect(logoutResponse.status).toBe(200);
    expect(logoutResponse.data.message).toBe('Logout successful');
  });
});
