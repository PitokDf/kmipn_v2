import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { ResponseApiType } from "../types/api_types";
import { addUserService, DeleteUserById, editUSer, GetAllUser, GetByID } from "../services/user.service";
import { AppError, handlerAnyError } from "../errors/api_errors";
import { hashing } from "../utils/bcrypt";

export const getAllUser = async (req: Request, res: Response<ResponseApiType>) => {
    try {
        const users = await GetAllUser();
        return res.status(200).json({ success: true, message: "Successfully get data", data: users });
    } catch (error: any) {
        return handlerAnyError(error, res)
    }
}

export const GetUserById = async (req: Request, res: Response<ResponseApiType>) => {
    try {
        const params = req.params;
        const user = await GetByID(String(params.id));
        return res.status(200).json({ success: true, message: "Successfully get data", data: user });
    } catch (error) {
        return handlerAnyError(error, res)
    }
}

// export const CheckUserTeam = async (req: Request, res: Response) => {
//     try {
//         const sessionUser = (req as any).user;
//         const user = await GetByID(sessionUser.id);
//         const completed = user.teamMember !== null ? true : false;
//         return res.status(200).json({ success: true, complete: completed });
//     } catch (error) {
//         return handlerAnyError(error, res)

//     }
// }

export const DeleteUser = async (req: Request, res: Response<ResponseApiType>) => {
    try {
        const { id } = req.params;
        const userIdLogin = (req as any).user;

        if (id === userIdLogin?.id) {
            throw new AppError("Tidak dapat menghapus akun sendiri.", 400);
        }
        const user = await DeleteUserById(id);
        return res.status(200).json({ success: true, message: "Successfully delete user " + user.name })
    } catch (error) {
        return handlerAnyError(error, res)

    }
}

export const updateUser = async (req: Request, res: Response<ResponseApiType>) => {
    try {
        const { id } = req.params
        const { email, password, nama, role } = req.body
        let hashedPassword = null
        if (password) {
            hashedPassword = await hashing(password);
        }

        await editUSer(id, email, hashedPassword, nama, role);

        return res.status(200).json({ success: true, message: "Successfully update user" });
    } catch (error) {
        return handlerAnyError(error, res)

    }
}

export const addUser = async (req: Request, res: Response<ResponseApiType>) => {
    try {
        const { name, password, role, email } = req.body

        const hashedPassword = await hashing(password);
        const user = await addUserService(email, hashedPassword!, name, role, password);
        return res.status(201).json({ success: true, message: "Berhasil menambahkan user baru, silahkan beritahu user untuk memverifikasi emailnya", data: user });
    } catch (error) {
        return handlerAnyError(error, res)

    }
}