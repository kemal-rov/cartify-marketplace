import { Response } from 'express';

export type MockResponse = {
    status: jest.Mock<Response, [number]>;
    sendStatus: jest.Mock<Response, [number]>;
    json: jest.Mock<Response, [any]>;
    end: jest.Mock<void, []>;
    cookie: jest.Mock<Response, [string, string, object?]>;
} & Response;