import express from 'express';
import { getAllUsers } from '../controllers/users';

export default (router: express.Router) => {
    router.get('/users', getAllUsers);
}