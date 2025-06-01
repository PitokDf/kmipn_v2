
import crypto from "crypto";
import dotenv from "dotenv";
import { DeleteUserById } from "./user.service";
import path from "path";
import { findToken } from "./user_token.service";
import { User } from "@prisma/client";
import { hashing, verifyHash } from "../utils/bcrypt";
import { prisma } from "../configs/prisma";
import { AppError } from "../errors/api_errors";
import { readHtmlFile } from "../utils/read_html_file";
import { replacePlaceholders } from "../utils/replace_placeholder";
import { sendEmail } from "../utils/mailer";

dotenv.config();

export const registerService = async (email: string, password: string, name: string) => {
    // cek email sudah tersedia atau belum
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    // jika email sudah tersedia lepar error
    if (existingUser) throw new AppError("User already exists", 400);

    // enkripsi password untuk disimpan ke databases
    const hashedPassword = await hashing(password);

    // membuat user baru
    const newUser = await prisma.user.create({ data: { name, email, password: hashedPassword! } });

    await sendEmailVerfikasi(newUser, password)
    // kembalikan data user
    return newUser;
}

export const verifyTokenService = async (token: string) => {
    const usertToken = await findToken(token);
    // melakukan pengecekan apakah tokan valid
    if (!usertToken) throw new AppError("Invalid or expired token", 400);
    // melakukan pengecekan apakah token sudah expire atau belum
    if (usertToken.expiresAt < new Date()) throw new AppError("Token expired", 400);
    // update kolom verified jadi true
    await prisma.user.update({
        where: { id: usertToken.userId },
        data: { verified: true }
    });
    // hapus token dari table user token setelah proses berhasil
    await prisma.userToken.deleteMany({ where: { id: usertToken.id } });
    return true;
}

export const sendEmailVerfikasi = async (user: User, password?: string) => {
    // membuat verifikasi token dengan dependency crypto
    const verivicationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiryDate = new Date(); // set token expire
    tokenExpiryDate.setHours(tokenExpiryDate.getHours() + 1)

    // membuat token untuk user
    await prisma.userToken.create({ data: { token: verivicationToken, userId: user.id, expiresAt: tokenExpiryDate } });

    // mengirim email verifikasi ke user
    const filePath = path.join(__dirname, '../templates/VerivicationEmail.html')
    let emailContent = await readHtmlFile(filePath);
    const verificationLink = `${process.env.FRONTEND_URL}/auth/verify-email?token=${verivicationToken}`;
    const placeholders = {
        "{{ verificationLink }}": verificationLink,
        "{{ type_of_action }}": "Verify email",
        "{{ name }}": user.name,
        "{{ email }}": user.email,
        "{{ password }}": password ?? ""
    };
    emailContent = replacePlaceholders(emailContent, placeholders)
    const sendEmailSuccess = await sendEmail(user.email, "Verify email", emailContent);

    // jika email verifikasi gagal terkirim maka lempar error dan hapus user
    if (!sendEmailSuccess) {
        DeleteUserById(user.id);
        throw new AppError("Periksa koneksi internetmu!", 400);
    }
}

export const loginService = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email }, include: { TeamMember: true } });
    if (!user) throw new AppError("Pengguna belum terdaftar.", 404);
    // cek apakah email sudah di verifikasi
    if (!user?.verified) throw new AppError("Please verify your email.", 400);
    // cek apakah user tersedia dan password tersedia
    if (!user || !(await verifyHash(password, user.password))) throw new AppError("Email atau password salah!", 400);
    return user;
}

export const forgotPasswordService = async (email: string) => {
    const checkEmail = await prisma.user.findFirst({ where: { email } })
    if (!checkEmail) throw new AppError(`${email} tidak terdaftar`, 400);

    const token = await prisma.userToken.findFirst({
        where: { User: { email: email } }
    });

    if (token?.expiresAt! > new Date()) {
        throw new AppError("Anda telah mengajukan permintaan reset kata sandi. Mohon tunggu selama 1 jam sebelum mencoba kembali.", 400)
    }

    if (token && (token.expiresAt < new Date())) {
        await prisma.userToken.delete({ where: { id: token.id } });
    }


    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiryDate = new Date(Date.now() + 3600 * 1000);
    const newToken = await prisma.userToken.create({
        data: {
            expiresAt: tokenExpiryDate,
            token: resetToken,
            userId: checkEmail.id
        }
    });

    const resetLink = `${process.env.FRONTEND_URL}/auth/forgot-password/${resetToken}`;
    const filePath = path.join(__dirname, '../templates/EmailResetPassword.html')
    let emailContent = await readHtmlFile(filePath);
    const placeholders = {
        "{{ resetLink }}": resetLink
    };
    emailContent = replacePlaceholders(emailContent, placeholders);

    const sendEmailSuccess = await sendEmail(checkEmail.email, "Reset Password", emailContent);

    if (!sendEmailSuccess) {
        await prisma.userToken.delete({ where: { id: newToken.id } })
        throw new AppError("Periksa koneksi internetmu!", 400);
    }
    return newToken;
}

export const checkTokenResetService = async (token: string) => {
    const usertToken = await findToken(token);
    // melakukan pengecekan apakah tokan valid
    if (!usertToken) throw new AppError("Invalid or expired token", 400);
    // melakukan pengecekan apakah token sudah expire atau belum
    if (usertToken.expiresAt < new Date()) throw new AppError("Token expired", 400);
    // hapus token dari table user token setelah proses berhasil
    // await prisma.userToken.delete({ where: { id: usertToken.id } });
    return usertToken.userId;
}

export const resetPasswordService = async (password: string, userId: string) => {
    const userUpdated = await prisma.user.update({
        data: { password }, where: { id: userId },
        include: { UserToken: { select: { id: true } } }
    });
    await prisma.userToken.delete({ where: { id: userUpdated.UserToken[0].id } });
    return userUpdated;
}

export const resendEmailVerifikasiService = async (email: string) => {
    const user = await prisma.user.findFirst({
        where: { email }
    });

    if (!user) throw new AppError(`${email} tidak terdaftar!`)

    if (user?.verified) throw new AppError("Anda sudah terverifikasi!", 400);

    const userToken = await prisma.userToken.findFirst({
        where: { userId: user?.id }
    });

    if (userToken) throw new AppError("Email verifikasi sudah dikirim sebelumnya!", 400);
    sendEmailVerfikasi(user!, "")
    return true
}