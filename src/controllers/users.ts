import express from 'express';
import { getUsers, deleteUserById } from '../db/users';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();

        return res.status(200).json(users);
    } catch (error) {
        console.error(`There was an issue getting all users: ${error.message}`);
        return res.sendStatus(400);
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const deletedUser = await deleteUserById(id);

        return res.status(200).json(deletedUser).end();
    } catch (error) {
        console.error(`Something went wrong with deleting a user: ${error.message}`);
    }
}