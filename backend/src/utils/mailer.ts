import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { env } from "../configs/env";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure! === 'true', // true untuk port 465, false untuk port lainnya
    auth: {
        user: env.smtpUser,
        pass: env.smtpPass,
    },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        const info = await transporter.sendMail({
            from: `"KMIPN Support" <kmpipn@pnp.id>`,
            to,
            subject,
            html,
        });
        console.log('Email sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};