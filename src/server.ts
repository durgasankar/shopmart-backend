import dotenv from 'dotenv';
import express from 'express';
import app from './app';
import connectMongoDB from './configs/mongo-db';
import { connectPostgresDB } from './configs/postgres-db';

// loading env configs
dotenv.config();
const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
    try {
        // database connection
        await connectMongoDB();
        await connectPostgresDB();
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start the server.');
        process.exit(1); // stopping alll processes
    }
}

startServer();