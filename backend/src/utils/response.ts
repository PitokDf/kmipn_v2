import { Response } from "express";

export const successResponse = (
    res: Response,
    message: string,
    data: any,
    statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    })
}