import axiosInstace from "../axios";

export async function Login(data: { email: string, password: string, recaptchaToken: string }) {
    const res = await axiosInstace.post("/auth/login", data)
    return res.data
}

export async function register(data: { email: string, name: string, password: string, recaptchaToken: string }) {
    const res = await axiosInstace.post("/auth/register", data)
    return res.data
}

export async function sendEmailForgotPassword(data: { email: string, recaptchaToken: string }) {
    const res = await axiosInstace.post("/auth/forgot-password", data)
    return res.data
}

export async function checkResetToken(token: string) {
    const res = await axiosInstace.get(`/auth/check-token/${token}`)
    return res.data
}

export async function resetPassword(data: { password: string, userId: string }) {
    const res = await axiosInstace.post("/auth/reset-password", data)
    return res.data
}

export async function resendEmailVerifikasi(data: { email: string, recaptchaToken: string }) {
    const res = await axiosInstace.post("/auth/resend-verifikasi-email", data)
    return res.data
}