import { body } from "express-validator";

export const reviewProposalValidator = [
    body("status").notEmpty().withMessage("Status harus dipilih"),
    body("comments").notEmpty().withMessage("Umpan balik harus diisi"),
]