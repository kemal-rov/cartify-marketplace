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
    // Delete the user
    await axiosInstance.delete(`${url}/users/${userId}`);
  });

  it('should login the user', async () => {
    // Attempt to logout before logging in to ensure a clean session
    await axiosInstance.post(`${url}/auth/logout`);

    const loginResponse = await axiosInstance.post(`${url}/auth/login`, {
      email: newEmail,
      password: password,
    });
    expect(loginResponse.status).toBe(200);
    // Adjusted to check for a property that exists in your user object upon successful login
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
