import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import session from 'express-session';
import routes from './routes/index';
import { requestLogger } from './middlewares/request-logger';
import viewRoutes from './views/view-routes';


const app: Application = express()
// loading env configs
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// loggging the routes
app.use(requestLogger);

// ejs templets setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(
    session({
        secret: process.env.EXPRESS_SESSION_SECRET as string,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, 
            httpOnly: true, 
            maxAge: 24 * 60 * 60 * 1000
        }
    })
);
app.use('/uploads', express.static('uploads'));

// register routes
app.use('/api', routes)

// ejs templets view and session creation
app.use('/', viewRoutes);



export default app;