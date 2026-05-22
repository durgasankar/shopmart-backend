import { Router, Request, Response } from "express";

const router = Router();

router.get('/', (req: Request, res: Response) => {
    console.log('object')
    res.send('Api is running...')
})

export default router;