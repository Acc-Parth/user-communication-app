import mongoose from 'mongoose';
import { ENV } from './env.js'; // Import the ENV object from env.js

export const connectDB = async () => {
    try{
        const conn = await mongoose.connect(ENV.MONGO_URI);
        console.log("MONGO DB CONNECTED SUCCESSFULLY", conn.connection.host);
    }
    catch(error){
        console.log("MONGO DB CONNECTION FAILED", error);
        process.exit(1); // 1: failure, 0: success
    }
}