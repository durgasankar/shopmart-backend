import { Request, Response, Router } from "express";
import { UserController } from "../controller/User";

const router = Router();
const { registerUserController } = new UserController;

router.get('/all', (req: Request, res: Response) => {
    res.send('you are inside all routes');
})

router.post('/register', registerUserController);

export default router;