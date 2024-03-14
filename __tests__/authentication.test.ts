import axios, { AxiosResponse } from 'axios';
import { email, username, password } from '../src/utils/data.json';
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
        await axios.delete(`${url}/users/${userId}`);

        const response = await axios.post(`${url}/auth/login`);
        expect(response.status).toBe(403);
        
    });
  
    it('should login the user', async () => {
        // First, make sure the user is logged out
        await axios.post(`${url}/auth/logout`);

        const response = await axios.post(`${url}/auth/logout`, {}, {
            headers: {
            Cookie: `AUTH_TOKEN=${userToken}`, 
            },
        });

        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('authentication.sessionToken');
        userToken = response.data.authentication.sessionToken; // Save the token for logout test
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