import { Request, Response, Router } from "express";
import userRoutes from './User';

const router = Router();

router.get('/test', (req: Request, res: Response) => {
    res.send('you are inside @domain:port/api/test route');
})

router.use('/user', userRoutes);

export default router;