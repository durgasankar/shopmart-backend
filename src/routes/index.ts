import { Request, Response, Router } from "express";
import userRoutes from './User';
import productRoutes from './Product';
import cartRoutes from './Cart';

const router = Router();

router.get('/test', (req: Request, res: Response) => {
    res.send('you are inside @domain:port/api/test route');
})

router.use('/user', userRoutes);
router.use('/product', productRoutes);
router.use('/cart', cartRoutes);

export default router;