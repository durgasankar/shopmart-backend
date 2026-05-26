import express, { Application } from 'express';
import cors from 'cors';
import routes from './routes/index';
import { requestLogger } from './middlewares/request-logger';

const app: Application = express()

app.use(cors());

// loggging the routes
app.use(requestLogger);

// register routes
app.use('/api', routes)

export default app;