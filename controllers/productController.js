import { v2 as cloudinary } from 'cloudinary';
import productModel from "../models/productModel.js";
import errorResponse from '../middlewares/errorResponse.js';

export const addProduct = async (req, res, next) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestSeller } = req.body;
        const image1 = req.files.image1 && req.files.image1[0],
            image2 = req.files.image2 && req.files.image2[0],
            image3 = req.files.image3 && req.files.image3[0],
            image4 = req.files.image4 && req.files.image4[0];
        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);
        if (images.length === 0) {
            const error = errorResponse(409, 'Images not uploaded.');
            throw error;
        }

        const imageUrl = await Promise.all(images.map(async (item) => {
            const result = await cloudinary.uploader.upload(item.path, { resource_type: 'image', folder: 'forever', timeout: 120000 });
            return result.secure_url;
        }))
        console.log('imageUrl', imageUrl);

        if (imageUrl.length === 0) {
            const error = errorResponse(409, 'Images failed to upload.');
            throw error;
        }

        const productData = await productModel.create({
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            sizes: typeof sizes === 'string' ? JSON.parse(sizes) : sizes,
            bestSeller: bestSeller === 'true' ? true : false,
            image: imageUrl,
            date: new Date()
        })
        return res.status(200).json({ success: true, message: 'Product added successfully', data: productData })
    } catch (error) {
        console.log('error', error);
        next(error);
    }
}

export const listProduct = async (req, res, next) => {
    try {
        await productModel.updateMany({ status: 'ACTIVE'})
        const productData = await productModel.find({ status: 'ACTIVE' });
        return res.status(200).json({
            success: true,
            count: productData.length,
            data: productData
        })
    } catch (error) {
        next(error);
    }
}

export const removeProduct = async (req, res, next) => {
    try {
        const { productId } = req.body;
        // const result = await productModel.updateOne({ _id: productId }, { $set: { status: 'DELETED' } });
        return res.status(200).json({ success: true, message: "Product Removed" })
    } catch (error) {
        next(error);
    }
}

export const singleProduct = async (req, res, next) => {
    try {
        const { productId } = req.params;
        console.log('productId', productId);
        const product = await productModel.findById({ _id: productId });
        return res.status(200).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
}