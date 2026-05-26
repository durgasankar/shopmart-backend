import dotenv from 'dotenv';
import app from './app';
import connectMongoDB from './configs/mongo-db';
import { connectPostgresDB } from './configs/postgres-db';
import { logger } from './configs/winston-logger';

// loading env configs
dotenv.config();
const PORT: number = Number(process.env.PORT) || 5000;

const startServer = async (): Promise<void> => {
    try {
        // database connection
        await connectMongoDB();
        await connectPostgresDB();
        app.listen(PORT, () => {
            logger.info(`Server started on port ${PORT}`)
        });
    } catch (error: any) {
        logger.error('Failed to start the server.', { message: error.message, stack: error.stack });
        process.exit(1); // stopping alll processes
    }
}

startServer();