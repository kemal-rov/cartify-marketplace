import express from 'express';
import { getUsers } from '../db/users';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();

        return res.status(200).json(users);
    } catch (error) {
        console.error(`There was an issue getting all users: ${error.message}`);
        return res.sendStatus(400);
    }
}