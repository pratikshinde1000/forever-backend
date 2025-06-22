import mongoose from "mongoose";

export const connectDB = async () => {

    console.log('Mongo Connect', process.env.MONGO_URL);

    mongoose.connect(process.env.MONGO_URL).then((response)=> {
        console.log('Database Connected');
    }).catch((error)=> {
        console.log('Database Error', error)
    })
}
