import axios, { AxiosResponse } from 'axios';
import { email, username, password } from '../utils/data.json';
import * as dotenv from 'dotenv';
dotenv.config();

describe('Authentication Tests', () => {
    const url = process.env.BASE_URL_LOCAL;
    let userToken: string;
    let userId: string;

    beforeAll(async() => {
        // Create a new user
        const response: AxiosResponse = await axios.post(`${url}/auth/register`, {
            email: email,
            password: password,
            username: username,
        });

        userToken = response.data.authentication.sessionToken
        userId = response.data._id;

        expect(response.status).toBe(200);
        expect(response.data.email).toBe(email);
    });

    afterAll(async() => {
        // Delete the user
        await axios.delete(`${url}/users/${userId}`, {
            headers: {
            Cookie: `AUTH_TOKEN=${userToken}`, 
            },
        });

        const response = await axios.post(`${url}/auth/login`);
        expect(response.status).toBe(403);
    });
  
    it('should login the user', async () => {
        // First, make sure the user is logged out
        const logout: AxiosResponse = await axios.post(`${url}/auth/logout`, {}, {
            headers: {
            Cookie: `AUTH_TOKEN=${userToken}`, 
            },
        });

        expect(logout.status).toBe(200 || 403);
        expect(logout.data.message).toBe("Logout successful" || undefined);

        const login: AxiosResponse = await axios.post(`${url}/auth/login`, {
            email: email,
            password: password,
        });
        expect(login.status).toBe(200);
        expect(login.data).toHaveProperty('authentication.sessionToken');
    });
  
    it('should logout the user', async () => {
        const response = await axios.post(`${url}/auth/logout`, {}, {
            headers: {
            Cookie: `AUTH_TOKEN=${userToken}`, 
            },
        });
        expect(response.status).toBe(200);
        expect(response.data.message).toBe('Logout successful');
    });
});