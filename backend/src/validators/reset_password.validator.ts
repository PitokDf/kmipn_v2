import { body } from "express-validator";

export const resetPasswords = [
    body("password").isLength({ min: 8 })
        .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter, ")
        .matches(/[A-Z]/).withMessage("one uppercase letter, ")
        .matches(/[0-9]/).withMessage("one number, ")
        .matches(/[\W_]/).withMessage("one symbol")
]