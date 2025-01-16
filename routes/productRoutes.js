import express from 'express';
import { addProduct, removeProduct, singleProduct, listProduct } from '../controllers/productController.js';
import upload from '../middlewares/multer.js';
import adminAuth from '../middlewares/adminAuth.js';
const productRoutes = express.Router();

productRoutes.post('/add', adminAuth, upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }]), addProduct);
// productRoutes.post('/add', addProduct);
productRoutes.post('/remove', adminAuth, removeProduct);
productRoutes.get('/single/:productId', singleProduct);
productRoutes.get('/get', listProduct);

export default productRoutes;