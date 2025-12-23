import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
        console.log("Connect DB success");
    } catch (error) {
        console.log("Connect DB fail");
        process.exit(1);
    }
}