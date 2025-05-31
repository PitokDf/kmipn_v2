import { Router } from "express";
import { RegisterValidator } from "../validators/RegisterValidator";
import { handleValidationErrors } from "../middlewares/handle_validation_errors";
import { login, logout, register, verifyEmail } from "../controllers/auth.controller";
import { loginValidator } from "../validators/LoginValidator";

const authRouter = Router()

authRouter.post("/register", RegisterValidator, handleValidationErrors, register)
authRouter.post("/login", loginValidator, handleValidationErrors, login)
authRouter.post("/logout", logout)
authRouter.post("/verify-email", verifyEmail)

export default authRouter