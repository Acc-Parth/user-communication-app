import mongoose from 'mongoose';

export const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("MONGO DB CONNECTED SUCCESSFULLY", conn.connection.host);
    }
    catch(error){
        console.log("MONGO DB CONNECTION FAILED", error);
        process.exit(1); // 1: failure, 0: success
    }
}