import { Request, Response, Router } from "express";
import userRoutes from './User';
import productRoutes from './product';

const router = Router();

router.get('/test', (req: Request, res: Response) => {
    res.send('you are inside @domain:port/api/test route');
})

router.use('/user', userRoutes);

router.use('/product', productRoutes);

export default router;