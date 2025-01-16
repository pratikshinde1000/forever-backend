import expres from 'express';
import 'dotenv/config';
import cors from 'cors';
import { connectDB } from './config/database.js';
import { connectCloudinary } from './config/cloudinary.js';
import userRouter from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRouter from './routes/cartRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import morgan from 'morgan';
import dns from "node:dns/promises";
import orderRouter from './routes/orderRoutes.js';
dns.setServers(["1.1.1.1"]);


const app = expres();
const PORT = process.env.PORT || 3000;

app.use(expres.json());
app.use(cors());

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

connectDB();
connectCloudinary();


app.use('/api/user', userRouter);
app.use('/api/product', productRoutes);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

app.use(errorHandler);

app.listen(PORT, ()=> console.log('Server Started', PORT));
