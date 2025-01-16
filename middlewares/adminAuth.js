import jwt from 'jsonwebtoken';
import errorResponse from './errorResponse.js';

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.headers;
        if(!token){
            const error = await errorResponse(409, 'Not Authorized!')
            throw error;
        }
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        if(decoded && decoded.id === process.env.ADMIN_ID ){
            next();
        }else{
            const error = errorResponse(409, 'Token Not Found!');
            throw error;
        }
    } catch (error) {
        next(error);
    }

}

export default adminAuth;