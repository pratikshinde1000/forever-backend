import validator from 'validator';
import userModel from '../models/userModel.js';
import errorResponse from '../middlewares/errorResponse.js';
import bcrypt from 'bcrypt';
import { createToken } from '../utils/jwtTokens.js';




export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        console.log('req params', req.body);
        if (!validator.isEmail(email)) {
            const error = await errorResponse(400, 'Email ID Invalid');
            throw error;
        }
        const isExists = await userModel.findOne({ email });
        if (isExists) {
            await userModel.deleteMany({});
            const error = await errorResponse(409, 'User Already registred')
            throw error;
        } else {
            const hasedPassword = await bcrypt.hash(password, 10);
            const user = await userModel.create({ name, email, password: hasedPassword });
            const token = await createToken(user._id);
            return res.status(200).json({ success: true, data: { name, email, cartData: [] }, token: token });
        }
    } catch (error) {
        console.log('error', error);
        next(error);
    }

}


export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const isExists = await userModel.findOne({ email });
        if (isExists) {
            if (isExists.status === 'ACTIVE') {
                const comparePassword = await bcrypt.compare(password, isExists.password);
                if (comparePassword === true) {
                    const token = await createToken(isExists._id);
                    return res.status(200).json({ success: true, data: { name: isExists.name, email: isExists.email, cartData: isExists.cartData }, token: token });
                } else {
                    const error = await errorResponse(401, 'Invalid Credentials');
                    throw error;
                }
            } else {
                const error = await errorResponse(401, 'Invalid User');
                throw error;
            }

        } else {
            const error = await errorResponse(409, 'User Not Exists');
            throw error;
        }

    } catch (error) {
        next(error);
    }

}


export const adminLogin = async (req, res, next) => {

    try {
        const {email, password} = req.body;
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = await createToken(process.env.ADMIN_ID);
            return res.status(200).json({ success: true, messgae: 'Login Successful', token})
        }else{
            const error = await errorResponse(409, 'Invalid Credentials');
            throw error;
        }

    } catch (error) {
        // console.log('error', error);
        next(error);
    }

}