import { Router } from "express";
import userRoutes from './User';

const router = Router();

router.use('/user', userRoutes);

export default router;