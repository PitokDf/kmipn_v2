import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { env } from '../configs/env';

export const verifyRecaptcha = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.body.recaptchaToken;

    if (!token) {
        return res.status(400).json({ message: 'reCAPTCHA token is missing' });
    }

    try {
        const secret = env.RECAPTCHA_SECRET_KEY;
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify`,
            new URLSearchParams({
                secret: secret || '',
                response: token,
            }).toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        const data = response.data;

        if (!data.success) {
            return res.status(403).json({ message: 'reCAPTCHA verification failed', detail: data });
        }

        next();

    } catch (error) {
        console.error('Error verifying reCAPTCHA:', error);
        return res.status(500).json({ message: 'Internal server error verifying reCAPTCHA' });
    }
};
