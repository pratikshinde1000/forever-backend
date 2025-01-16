import mongoose from "mongoose";
import { USER_STATUS_OPTIONS } from "../config/constant.js";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Array, default: [] },
    status: { type: String, default: 'ACTIVE', enum: USER_STATUS_OPTIONS }
}, { timestamps: true })

const userModel = mongoose.model('users', userSchema);
export default userModel;