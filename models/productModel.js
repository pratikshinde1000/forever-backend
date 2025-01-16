import mongoose from "mongoose";
import { PRODUCT_STATUS_OPTIONS } from "../config/constant.js";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    sizes: { type: Array, required: true },
    bestSeller: { type: Boolean, default: false },
    date: { type: Date, required: true },
    status: { type: String, enum: PRODUCT_STATUS_OPTIONS, default: 'ACTIVE' }
}, { timestamps: true })

const productModel = mongoose.model('products', productSchema);

export default productModel;