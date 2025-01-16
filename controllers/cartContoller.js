import userModel from "../models/userModel.js";
import errorResponse from "../middlewares/errorResponse.js";


export const addTocart = async (req, res, next) => {
    try {
        const { userId, cartData } = req.body;

      
        const existingUser = await userModel.findOne({ _id: userId });

        if (!existingUser) {
            const error = errorResponse(409, 'Invalid User!');
            throw error;
        }

        await existingUser.updateOne({ _id: userId }, { $set: { cartData } });

        return res.status(200).json({ success: true, message: 'Added to cart!', })


    } catch (error) {
        next(error);
    }

}


export const updateCart = async (req, res, next) => {
    try {
        const { userId, cartData } = req.body;
        const existingUser = await userModel.findOne({ _id: userId });
        if (!existingUser) {
            const error = errorResponse(409, 'Invalid User!');
            throw error;
        }
        existingUser.cartData = cartData;
        existingUser.save();
        return res.status(200).json({ success: true, message: 'Added to cart!', })
    } catch (error) {
        next(error);
    }
}

export const getUserCart = async (req, res, next) => {
    try {
        const { userId, cartData } = req.body;
        const existingUser = await userModel.findOne({ _id: userId });
        if (!existingUser) {
            const error = errorResponse(409, 'Invalid User!');
            throw error;
        }
        return res.status(200).json({ success: true, data: existingUser.cartData || [] })
    } catch (error) {
        next(error);
    }
}

