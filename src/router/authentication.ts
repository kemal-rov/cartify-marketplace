import express from 'express';
import { register, login, logout } from '../controllers/authentication';
import { isAuthenticated } from '../middleware';

export default (router: express.Router) => {
  router.post('/auth/register', register);
  router.post('/auth/login', login);
  router.post('/auth/logout', isAuthenticated, logout);
};
