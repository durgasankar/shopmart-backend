import { Request, Response, Router } from "express";
import { UserController } from "../controllers/User";
import { validateRegister } from "../middlewares/validate";

const router = Router();
const { registerUserController } = new UserController;

router.get('/test', (req: Request, res: Response) => {
    res.send('you are inside domain/api/user/test route');
})

router.post('/register', validateRegister, registerUserController);

export default router;