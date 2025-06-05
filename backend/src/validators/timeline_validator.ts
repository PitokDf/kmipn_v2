import { body } from "express-validator";

export const createTimelineValidator = [
    body('title').notEmpty().withMessage("Title tidak boleh kosong"),
    body('description').notEmpty().withMessage("Deskripsi tidak boleh kosong"),
    body('startTime').notEmpty().withMessage("startTime tidak boleh kosong"),
    body('endTime').notEmpty().withMessage("endTime tidak boleh kosong")
]

export const updateTimelineValidator = [
    body('title').optional().bail().notEmpty().withMessage("Title tidak boleh kosong"),
    body('description').optional().bail().notEmpty().withMessage("Deskripsi tidak boleh kosong"),
    body('startTime').optional().bail().notEmpty().withMessage("startTime tidak boleh kosong"),
    body('endTime').optional().bail().notEmpty().withMessage("endTime tidak boleh kosong")
]