import { Request, Response, Router } from "express";
import { UserController } from "../controllers/User";
import { validateRegisterRequest, validateLoginRequest } from "../middlewares/validate";

const router = Router();
const { registerUserController } = new UserController;

router.post('/register', validateRegisterRequest, registerUserController);

// router.post('/login', validateLoginRequest, loginUserController)

export default router;