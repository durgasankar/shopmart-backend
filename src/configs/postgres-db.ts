import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import { logger } from "./winston-logger";

dotenv.config();
type DialectType = "postgres";

const {
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_DIALECT,
} = process.env;

if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST || !DB_DIALECT) {
    throw new Error("Missing required environment variables");
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: DB_DIALECT as DialectType,
    logging: false,
});

export const connectPostgresDB = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        await sequelize.sync()
        logger.info('✅ Postgres DB connected successfully');
    } catch (error: any) {
        logger.error('Database connection failed:', { message: error.message, stack: error.stack });
        throw new Error('Database connection failed:');
    }
}

export default sequelize;