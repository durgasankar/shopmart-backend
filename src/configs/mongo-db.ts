import mongoose from "mongoose";
import dotenv from "dotenv";
import { logger } from "./winston-logger";

dotenv.config();

const connectMongoDB = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        logger.info('✅ MongoDB connected successfully');
    } catch (error: any) {
        // console.error("Failed to connect to MongoDB:", error);
        logger.error('Database connection failed:', { message: error.message, stack: error.stack });
        throw new Error('Database connection failed:');
    }
};

export default connectMongoDB;
