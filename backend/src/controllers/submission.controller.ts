import { NextFunction, Request, Response } from "express";
import { handlerAnyError } from "../errors/api_errors";
import { ResponseApiType } from "../types/api_types";
import { findTeamUser } from "../services/user.service";
import { drive, uploadFileToDrive } from "../services/google_drive.service";
import { createSubmissionService, deleteSubmissionService, getAllSubmission, updateSubmissionService } from "../services/submission.service";
import { emitToAdmin, emitToUser } from "../socket";
import archiver from "archiver";

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
        emitToAdmin("submission:update", {
            message: `Pengajuan baru dari tim: ${team?.name}`
        })

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
        const submissionMap = submissions.map((submission) => ({
            id: submission.id,
            teamId: submission.teamId,
            round: submission.round,
            title: submission.title,
            githubUrl: submission.githubUrl,
            fileUrl: submission.fileUrl,
            fileName: submission.fileName,
            status: submission.status,
            createdAt: submission.createdAt,
            updatedAt: submission.updatedAt,
            teamName: submission.Team.name
        }))

        return res.status(200).json({
            success: true,
            message: `Berhasil mendapatkan data submission`,
            data: submissionMap
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

        emitToUser(submission.Team.TeamMember[0].userId!, "submission:update", {
            message: `Pengajuan tim anda sudah di update, status "${status}"`
        })
        console.log(`emit to user ${submission.Team.TeamMember[0].userId!}`);

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


export const downloadAllSubmission = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const submissions = (await getAllSubmission()).filter(sub => sub.teamId);
        const latestSubmissions = Object.values(
            submissions.reduce((acc, sub) => {
                const teamId = sub.Team.id
                const current = acc[teamId]

                if (!current || sub.createdAt > current.createdAt) {
                    acc[teamId] = sub
                }

                return acc
            }, {} as Record<number, typeof submissions[0]>)
        )


        res.attachment("submissions.zip");

        if (latestSubmissions.length === 0) {
            return res.status(404).json({ message: "Tidak ada submission yang ditemukan!." })
        }

        res.setHeader('Content-Type', "application/zip")
        res.setHeader('Content-Disposition', `attachment; filename="submissions.zip"`)

        const archive = archiver("zip", { zlib: { level: 9 } });
        archive.on("error", err => next(err))
        archive.pipe(res);

        for (const p of latestSubmissions) {
            const fileId = (p.fileUrl as any).match(/\/d\/(.+?)\//)?.[1]
            const driveRes = await drive.files.get(
                { fileId: fileId, alt: "media" },
                { responseType: "stream" }
            );
            archive.append(driveRes.data as import("stream").Readable, { name: `${p.Team.name}_${p.title}.zip` })
        }
        await archive.finalize()
    } catch (error: any) {
        next(error)
    }
}