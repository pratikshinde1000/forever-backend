import express from 'express';
import { getUserCart, addTocart, updateCart } from '../controllers/cartContoller.js';
import authenticate from '../middlewares/authenticate.js';
const cartRouter = express.Router();

cartRouter.get('/get', authenticate, getUserCart);
cartRouter.post('/add', authenticate, addTocart);
cartRouter.post('/update', authenticate, updateCart);


export default cartRouter;