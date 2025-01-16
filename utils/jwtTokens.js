import jwt from 'jsonwebtoken';

export const createToken = async (id) => {
    try {
    const token = await jwt.sign({ id: id.toString() }, process.env.JWT_SECRET, {expiresIn: 24*60*60});
    return token   
    } catch (error) {
        console.log('error', error);
    }
}