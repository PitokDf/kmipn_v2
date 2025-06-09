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
import { verifyRecaptcha } from "../middlewares/verifyCaptcha";

const authRouter = Router()

authRouter.post("/register", verifyRecaptcha, RegisterValidator, handleValidationErrors, register)
authRouter.post("/login", verifyRecaptcha, loginValidator, handleValidationErrors, login)
authRouter.post("/logout", logout)
authRouter.post("/verify-email", verifyEmail)
authRouter.post("/forgot-password", verifyRecaptcha, forgotPassword)
authRouter.post("/reset-password", resetPasswords, resetPassword)
authRouter.post("/resend-verifikasi-email", verifyRecaptcha, resendEmailVerifikasi)
authRouter.get("/check-token/:token", checkTokenReset)

export default authRouter