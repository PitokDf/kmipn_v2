import { Request, Response } from "express";
import { handlerAnyError } from "../errors/api_errors";
import { ResponseApiType } from "../types/api_types";
import { findTeamUser } from "../services/user.service";
import { uploadFileToDrive } from "../services/google_drive.service";
import { createSubmissionService, deleteSubmissionService, getAllSubmission, updateSubmissionService } from "../services/submission.service";

export async function createSubmissionController(req: Request, res: Response<ResponseApiType>) {
    try {
        const user = (req as any).user;
        const team = await findTeamUser(user.id)

        const allowedMimeType = ["application/zip"]; // type file yang diizinkan adalah zip
        const file_submission = req.file;

        if (!allowedMimeType.includes(file_submission?.mimetype!)) {
            return res.status(400).json({
                success: false,
                message: "File submission hanya boleh zip yaa, nggak boleh yang lain."
            })
        }

        const { title, githubUrl, description } = req.body

        // upload file ke google drive
        const fileBuffer = file_submission?.buffer;
        const fileName = file_submission?.originalname;
        const mimeType = file_submission?.mimetype;
        const folderId = process.env.GOOGLE_DRIVE_FOLDER_SUBMISSION_ID || '';

        const uploadResult = await uploadFileToDrive(fileBuffer!, fileName!, mimeType!, folderId)

        const fileLink = uploadResult.webViewLink;

        const submission = await createSubmissionService(description, fileLink!, githubUrl, Number(team?.id), title, fileName!)

        return res.status(201).json({
            success: true,
            message: `Berhasil menyimpan submission "${title}"`,
            data: submission
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}

export async function getAllSubmissionController(req: Request, res: Response<ResponseApiType>) {
    try {

        const submissions = await getAllSubmission()

        return res.status(200).json({
            success: true,
            message: `Berhasil mendapatkan data submission`,
            data: submissions
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}

export async function updateSubmissionController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { id } = req.params
        const { status } = req.body
        const submission = await updateSubmissionService(Number(id), status)

        return res.status(200).json({
            success: true,
            message: `Berhasil mengupdate submission team "${submission.Team.name}"`,
            data: submission
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}
export async function deleteSubmissionController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { id } = req.params
        const submission = await deleteSubmissionService(Number(id))

        return res.status(200).json({
            success: true,
            message: `Berhasil menghapus submission team "${submission.Team.name}"`,
            data: submission
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}