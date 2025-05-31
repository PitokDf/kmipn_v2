import { RoleUser } from "@prisma/client";
import { AppError } from "../errors/api_errors";
import { prisma } from "../configs/prisma";
import { sendEmailVerfikasi } from "./auth.service";

export const GetAllUser = async () => {
    const users = await prisma.user.findMany({ orderBy: { name: "asc" } });
    return users;
}

export const GetByID = async (id: string) => {
    // mencari data user berdasarkan id
    const user = await prisma.user.findUnique({ where: { id }, include: { TeamMember: { include: { Team: true } } } });
    // jika data user tidak tidak ditemukan maka lempar error
    if (!user) throw new AppError("User not found", 404);
    // jika data user ditemukan kembalikan data user
    return user;
}

export async function findTeamUser(userId: string) {
    const user = await prisma.user.findFirst({
        where: { id: userId, },
        include: { TeamMember: { include: { Team: { select: { id: true, name: true } } } } }
    })

    return user?.TeamMember?.Team
}

export const CheckEmailExist = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: { email: String(email) }
    });

    return user ? true : false;
}

export const DeleteUserById = async (id: string) => {
    // cari user berdasarkan id
    const user = await prisma.user.findUnique({ where: { id: String(id) } });
    // jika user tidak ditemukan lempar error
    if (!user) throw new AppError("User not found", 404);
    // jika ada hapus user
    await prisma.user.delete({ where: { id } });
    return user;
}

export const CheckEmailExistIgnoreId = async (email: string, id: string) => {
    const emailExist = await prisma.user.findFirst({ where: { email: email, NOT: { id: id } } });
    if (emailExist) return true;
}

export const editUSer = async (id: string, email: string, password: string | null, name: string, role: RoleUser) => {
    // mencari user berdasarkan email, jika email sudah tersedia lempar error
    const userExists = await prisma.user.findUnique({ where: { email: email, NOT: { id: id } } });
    if (userExists) throw new AppError("Email already exists", 400);

    const user = await prisma.user.findUnique({ where: { id: id } });
    // mencari user berdasarkan email, jika user tidak ada lempar error
    if (!user) throw new AppError("User not found", 404);

    const lastPassword = user.password
    let userUpdate = {}
    if (password !== null) {
        // update data user
        userUpdate = await prisma.user.update({
            data: { email, password, name, role }, where: { id }
        });
    } else {
        // update data user
        userUpdate = await prisma.user.update({
            data: { email, password: lastPassword, name, role }, where: { id }
        });
    }

    // jika user gagal diupdate maka lempar error
    if (!userUpdate) throw new AppError("failed update data user", 400);
    return userUpdate;
}

export const addUserService = async (email: string, password: string, name: string, role: RoleUser, rawpassword?: string) => {
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (user) throw new AppError("Email already exists", 400);
    // menambahkan data user ke database
    const newUser = await prisma.user.create({ data: { email, password, name, role } });
    await sendEmailVerfikasi(newUser, rawpassword);
    // jika gagal menambahan data lempar error
    if (!newUser) throw new AppError("Failed add new user", 400);
    // jika tidak ada error kembalikan data user yang baru dicreate
    return newUser;
}