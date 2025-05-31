import { body } from "express-validator";

export const loginValidator = [
    body('email').isEmail().withMessage("Enter valid email"),
    body('password').notEmpty().withMessage("Password can't empty")
];