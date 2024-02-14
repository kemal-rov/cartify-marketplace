import express from 'express';
import { getAllUsers } from '../controllers/users';
import { isOwner, isAuthenticated } from '../middleware';
import { deleteUser } from '../controllers/users';

export default (router: express.Router) => {
    router.get('/users', isAuthenticated, getAllUsers);
    router.get('/users/:id', isOwner, deleteUser);
}