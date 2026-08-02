import {Router} from "express";
import {validateRequest} from "../../middleware/validate";
import { RegisterUserSchema, LoginUserSchema } from "./auth.validation";
import { asynchanlder } from "../../middleware/asynchandler";
import { authenticate } from "../../middleware/authenticate";
import authController from "./auth.controller";

const router = Router();

router.post("/register" , validateRequest(RegisterUserSchema) , asynchanlder(authController.RegisterUserController))
router.post("/login" , validateRequest(LoginUserSchema) , asynchanlder(authController.LoginUserController))
router.post("/refresh-token" , asynchanlder(authController.RefreshTokenController))
router.post("/logout" , asynchanlder(authController.LogoutUserController))
router.get("/me" , authenticate , asynchanlder(authController.MeController))

export default router;



