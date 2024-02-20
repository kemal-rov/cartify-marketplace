import express from 'express';
import authentication from './authentication';
import users from './users';
import products from './products'
import cart from './cart';

const router = express.Router();

export default (): express.Router => {
    authentication(router);
    users(router);
    products(router);
    cart(router);

    return router;
}