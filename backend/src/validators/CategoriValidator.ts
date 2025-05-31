import { body } from "express-validator";

export const CategoriValidator = [
    body("categoriName").notEmpty({ ignore_whitespace: true }).withMessage("Category name required."),
    body("deadline").notEmpty().withMessage("Tanggal deadline harus diisi")
]