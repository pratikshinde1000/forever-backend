import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import errorResponse from "../middlewares/errorResponse.js";
import mongoose from "mongoose";
import razorpay from 'razorpay';
import { PAYMENT_STATUS } from "../config/constant.js";

const currency = process.env.CURRENCY;


const razorpayIstance = new razorpay({
    'key_id': process.env.RAZORPAY_KEY_ID,
    'key_secret': process.env.RAZORPAY_KEY_SECRET
})

const getOrderNumber = async () => {
    let order_no = 'FOREVER-1';
    let lastOrder = await orderModel.findOne({}).sort({ date: -1 });
    if (lastOrder) {
        let lastNumber = Number(lastOrder.order_no.slice(8)) + 1;
        // console.log('lastNum', lastNumber);
        return `FOREVER-${lastNumber++}`;
    } else {
        return order_no;
    }
}

export const createOrder = async (req, res, next) => {
    try {
        console.log('req params', req.body);
        const { userId, cartData, cartAmount, address, status, paymentMode, paymentStatus } = req.body;

        const existingUser = await userModel.findOne({ _id: userId });

        if (!existingUser) {
            const error = errorResponse(409, 'Invalid User!');
            throw error;
        }

        const order = new orderModel();
        order.order_no = await getOrderNumber();
        order.userId = userId;
        order.cartData = cartData;
        order.cartAmount = cartAmount;
        order.address = address;
        order.status = status;
        order.paymentMode = paymentMode;
        order.paymentStatus = paymentStatus;
        order.date = new Date();
        await order.save();

        if(paymentMode === 'RAZORPAY'){
            const options = {
                amount: cartAmount * 100,
                currency: currency.toUpperCase(),
                receipt: order.order_no
            }

            await razorpayIstance.orders.create(options, (error, razopay_order)=> {
                if(error){
                    console.log('error', error);
                    return res.status(409).json({ success: false, error: 'Failed to generate Order.'})
                }
                console.log('razorpay', razopay_order);
                return res.status(200).json({ success: true, message: 'Order Placed', data: order, razorpay_data: razopay_order })
            })

        }else{
            return res.status(200).json({ success: true, message: "order placed successfully", data: order });
        }
    } catch (error) {
        console.log('error', error);
        next(error);
    }
}

export const verifyRazorpay = async (req, res, next) => {
    try {
        const {  razorpay_order_id, userId } = req.body;
        console.log('razorpay_order_id', razorpay_order_id);

        const orderInfo = await razorpayIstance.orders.fetch(razorpay_order_id);

        // console.log('orderrIfo', orderInfo);
        if(orderInfo?.status === 'paid'){
            await orderModel.updateOne({order_no: orderInfo?.receipt },{ $set: { paymentStatus: PAYMENT_STATUS[0] } })
            await userModel.updateOne({ _id: userId }, { $set: { cartData: [] } });
            return res.status(200).json({ success: true })
        }else{
            const error = errorResponse(409, 'Payment Failed');
            throw error;
        }

    } catch (error) {
        console.log('verifyRazorpay error', error);
        next(error)
    }
}

export const getOrders = async (req, res, next) => {
    try {
        const userId = mongoose.Types.ObjectId.createFromHexString(req.body.userId);
        

        const orders = await orderModel.aggregate([
            { $match: { userId: userId } },
            { $unwind: { path: '$cartData' } },
            {
                $lookup: {
                    'localField': 'cartData._id',
                    'from': 'products',
                    'foreignField': '_id',
                    'as': 'cartData.products',
                },
            },
            { $unwind: { path: "$cartData.products" } },
            {
                $group: {
                    _id: '$_id',
                    cartData: {
                        $push: '$cartData'
                    }
                }
            },
            {
                $lookup: {
                    from: 'orders',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'orderDetails'
                }
            },
            {
                $unwind: {
                    path: '$orderDetails'
                }
            },
            {
                $addFields: {
                    'orderDetails.cartData': '$cartData'
                }
            },
            {
                $replaceRoot: {
                    newRoot: '$orderDetails'
                }
            },
            { $sort: { createdAt: -1 }  }
        ])


        return res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        next(error);
    }
}



export const updateOrderStatus = async (req, res, next) => {
    try {
        console.log('req params', req.body);
        const { order_no, status } = req.body;
        await orderModel.updateOne({ order_no }, { $set: { status } });
        return res.status(200).json({ success: true, message: "Order status updated!" })
    } catch (error) {
        next(error);
    }
}

export const getAllOrders = async (req, res, next) => {
    try {

        const orders = await orderModel.aggregate([
            { $match: {  } },
            { $unwind: { path: '$cartData' } },
            {
                $lookup: {
                    'localField': 'cartData._id',
                    'from': 'products',
                    'foreignField': '_id',
                    'as': 'cartData.products',
                },
            },
            { $unwind: { path: "$cartData.products" } },
            {
                $group: {
                    _id: '$_id',
                    cartData: {
                        $push: '$cartData'
                    }
                }
            },
            {
                $lookup: {
                    from: 'orders',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'orderDetails'
                }
            },
            {
                $unwind: {
                    path: '$orderDetails'
                }
            },
            {
                $addFields: {
                    'orderDetails.cartData': '$cartData'
                }
            },
            {
                $replaceRoot: {
                    newRoot: '$orderDetails'
                }
            },
            { $sort: { createdAt: -1 }  }
        ])

        return res.status(200).json({ success: true, count: orders.length, data: orders });

    } catch (error) {
        next(error);
    }
}