import express from 'express';
import { login, register } from '../src/controllers/authentication';
import * as dbOperations from '../src/db/users';
import { authentication, random } from '../src/helpers';

jest.mock('../src/db/users');

jest.mock('../src/helpers', () => ({
    authentication: jest.fn().mockImplementation((salt: string, password: string) => 'mockedValue'),
    random: jest.fn(() => 'mockedRandomValue'),
  }));

const mockedDbOperations = dbOperations as jest.Mocked<typeof dbOperations>;

const mockResponse = () => {
    const res: any = {}; // Temporarily use 'any'
    res.sendStatus = jest.fn().mockReturnThis();
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    res.cookie = jest.fn().mockReturnThis();
    res.end = jest.fn().mockReturnThis();
    return res as Response; 
  };

describe('Login Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if email or password is missing', async () => {
    const req = { body: {} } as express.Request;
    const res = mockResponse();
  
    // await login(req, res);
  
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return 403 if password does not match', async () => {
    
  });
});