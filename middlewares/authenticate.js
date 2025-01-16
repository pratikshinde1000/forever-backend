import jwt from 'jsonwebtoken';
import errorResponse from './errorResponse.js';


const authenticate = async (req, res, next) => {

    try {

        const { token } = req.headers;

        if (!token) {
            const error = await errorResponse(409, 'Token Not Found!');
            throw error;
        }

        const decoded = await jwt.verify(token, process.env.JWT_SECRET);

        if (decoded && decoded.id) {
            req.body.userId = decoded.id;
            next();
        } else {
            const error = await errorResponse(409, 'Invalid User!');
            throw error;
        }

    } catch (error) {
        // console.log('authenticate error', error);
        next(error)
    }

}

export default authenticate;