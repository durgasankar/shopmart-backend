import express, { Application } from 'express';
import cors from 'cors';
import routes from './routes/index';

const app: Application = express()

app.use(cors());

// register routes
app.use('/api', routes)

export default app;