import axios from 'axios';
import { email, username, password } from '../utils/data.json';
import { generateUniqueEmail, generateUniqueName } from '../helpers/dataGenerator';
import { setupTestUser, cleanupTestUser, axiosInstance } from '../utils';
import { TestUserSetup } from 'utils/types';
import * as dotenv from 'dotenv';
dotenv.config();

describe('Authentication Tests', () => {
  const url = process.env.BASE_URL_LOCAL;
  let setupInfo: TestUserSetup;
  const newEmail = generateUniqueEmail(email);
  const newUsername = generateUniqueName(username);

  beforeAll(async () => {
    // Setting up a new user
    setupInfo = await setupTestUser(newEmail, newUsername, password);
  });

  afterAll(async () => {
    // Delete the user
    const deleteResponse = await cleanupTestUser(setupInfo.userId, newEmail, password);
    expect(deleteResponse).not.toHaveProperty('authentication');
  });

  it('should reject duplicate user registration', async () => {
    try {
      await axiosInstance.post(`${url}/auth/register`, {
        email: newEmail,
        password,
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
    await axiosInstance.post(`${url}/auth/login`, { email: newEmail, password });

    const logoutResponse = await axiosInstance.post(`${url}/auth/logout`);
    expect(logoutResponse.status).toBe(200);
    expect(logoutResponse.data.message).toBe('Logout successful');
  });
});
