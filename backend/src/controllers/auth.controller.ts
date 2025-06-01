import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { generateToken } from "../utils/jwt";
import { ResponseApiType } from "../types/api_types";
import { handlerAnyError } from "../errors/api_errors";
import { checkTokenResetService, forgotPasswordService, loginService, registerService, resendEmailVerifikasiService, resetPasswordService, verifyTokenService } from "../services/auth.service";
import { hashing } from "../utils/bcrypt";

export const register = async (req: Request, res: Response<ResponseApiType>) => {
    try {
        const { email, name, password } = req.body;
        await registerService(email, password, name);
        return res.status(201).json({ success: true, message: "Pendaftaran berhasil. Harap periksa kotak masuk email Anda untuk menyelesaikan proses verifikasi." })
    } catch (error: any) {
        return handlerAnyError(error, res)
    }
}

export const verifyEmail = async (req: Request, res: Response<ResponseApiType>) => {
    try {
        const { token } = req.query
        const cektoken = await verifyTokenService(String(token));
        // if (!cektoken) throw new AppError("Something went wrong", 400);
        return res.status(200).json({ success: true, message: "Email verified successfully" });
    } catch (error) {
        return handlerAnyError(error, res)
    }
}


export const login = async (req: Request, res: Response<ResponseApiType>) => {
    // const existsAccessToken = req.cookies.accessToken;
    // if (existsAccessToken) { return res.status(400).json({ success: false, message: "You already login." }) }
    const { email, password } = req.body;
    try {

        const userValid = await loginService(email, password);
        const payload = {
            id: userValid.id,
            email: userValid.email,
            name: userValid.name,
            verified: userValid.verified,
            role: userValid.role,
            teamDataCompleate: userValid.TeamMember ? true : false
        }
        const accessToken = await generateToken(payload);
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" ? true : false,
            sameSite: process.env.NODE_ENV === "production" ? 'none' : "strict",
            path: "/",
            maxAge: 15 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true, message: "Successfully logged in", data: {
                user: payload,
                accessToken: accessToken
            }
        });
    } catch (error) {
        return handlerAnyError(error, res)
    }
}


export const logout = (req: Request, res: Response<ResponseApiType>) => {
    res.clearCookie('refreshToken'); // Hapus refresh token dari cookie
    res.clearCookie('accessToken'); // Hapus access token dari cookie
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const resendEmailVerifikasi = async (req: Request, res: Response<ResponseApiType>) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ success: false, message: "Validation required", errors });
        const { email } = req.body;
        const resendEmail = await resendEmailVerifikasiService(email);
        return res.status(200).json({
            success: true,
            message: "Berhasil mengirim email verifikasi."
        });
    } catch (error) {
        return handlerAnyError(error, res)
    }
}

export const forgotPassword = async (req: Request, res: Response<ResponseApiType>) => {
    try {
        const { email } = req.body;
        const resetService = await forgotPasswordService(email);
        return res.status(200).json({
            success: true,
            message: `Link reset password telah dikirim ke ${email}!`,
            data: resetService
        })

    } catch (error) {
        return handlerAnyError(error, res)
    }
}

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { password, userId } = req.body;
        console.log(password);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array());

            return res.status(400).json({
                success: false,
                message: "Kata sandi minimal 8 karakter, dan harus mengandung setidaknya satu huruf kecil, satu huruf kapital, satu angka, dan satu simbol.",
            });
        }

        const hashedPassword = await hashing(password);
        const reset = await resetPasswordService(hashedPassword!, userId);

        return res.status(200).json({
            success: true,
            message: "password berhasil dirubah, ENJOYYY.",
            data: reset
        });
    } catch (error) {
        return handlerAnyError(error, res)
    }
}


export const checkTokenReset = async (req: Request, res: Response<ResponseApiType>) => {
    try {
        const { token } = req.params;
        const check = await checkTokenResetService(token);
        res.status(200).json({
            success: true,
            message: "Token valid.",
            data: check
        });

    } catch (error) {
        return handlerAnyError(error, res)
    }
}