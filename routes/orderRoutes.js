import express from 'express';
import authenticate from '../middlewares/authenticate.js';
import adminAuth from '../middlewares/adminAuth.js';
import { createOrder, getOrders, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
const orderRouter = express.Router();

orderRouter.post('/create', authenticate, createOrder);
orderRouter.get('/get', authenticate, getOrders);
orderRouter.post('/update/status', adminAuth, updateOrderStatus);
orderRouter.get('/list', adminAuth, getAllOrders)


export default orderRouter;

