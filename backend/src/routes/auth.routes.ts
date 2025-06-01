import { Router } from "express";
import { RegisterValidator } from "../validators/RegisterValidator";
import { handleValidationErrors } from "../middlewares/handle_validation_errors";
import {
    checkTokenReset,
    forgotPassword,
    login,
    logout,
    register,
    resendEmailVerifikasi,
    resetPassword,
    verifyEmail
} from "../controllers/auth.controller";
import { loginValidator } from "../validators/LoginValidator";
import { resetPasswords } from "../validators/reset_password.validator";

const authRouter = Router()

authRouter.post("/register", RegisterValidator, handleValidationErrors, register)
authRouter.post("/login", loginValidator, handleValidationErrors, login)
authRouter.post("/logout", logout)
authRouter.post("/verify-email", verifyEmail)
authRouter.post("/forgot-password", forgotPassword)
authRouter.post("/reset-password", resetPasswords, resetPassword)
authRouter.post("/resend-verifikasi-email", resendEmailVerifikasi)
authRouter.get("/check-token/:token", checkTokenReset)

export default authRouter