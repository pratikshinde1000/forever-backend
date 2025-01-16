import mongoose from 'mongoose';
import { ORDER_STATUS, PAYMENT_MODE, PAYMENT_STATUS } from '../config/constant.js'
const Schema = mongoose.Schema;


const orderSchema = new Schema({
    order_no: { type: String, required: true, unique: true },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    cartData: [{
        _id: {
            type: Schema.Types.ObjectId,
            ref: 'products'
        },
        size: { type: String },
        price: { type: String },
        quantity: { type: String }
    }],
    cartAmount: { type: Number, required: true },
    address: {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        email: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        pincode: { type: String, required: true },
        contact: { type: String, required: true }
    },
    status: { type: String, required: true, enum: ORDER_STATUS },
    paymentMode: { type: String, required: true, enum: PAYMENT_MODE },
    paymentStatus: { type: String, required: true, enum: PAYMENT_STATUS },
    date: { type: Date }
}, { timestamps: true });

const orderModel = mongoose.model('orders', orderSchema);
export default orderModel;

