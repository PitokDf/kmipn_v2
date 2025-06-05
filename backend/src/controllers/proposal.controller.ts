import { NextFunction, Request, Response } from "express";
import { ResponseApiType } from "../types/api_types";
import { handlerAnyError } from "../errors/api_errors";
import { drive, uploadFileToDrive } from "../services/google_drive.service";
import { createProposalService, deleteProposalService, getAllproposalAproveServices, getProposalService, getProposalTeamService, replaceFileProposalService, updateProposalService } from "../services/proposal.service";
import { findTeamUser } from "../services/user.service";
import { emitToAdmin, emitToUser } from "../socket";
import archiver from "archiver"
import { env } from "../configs/env";

export const createProposal = async (req: Request, res: Response<ResponseApiType>) => {
    try {
        const user = (req as any).user;
        const team = await findTeamUser(user.id)

        const allowedMimeType = ["application/pdf"]; // type file yang diizinkan adalah pdf
        const file_proposal = req.file;

        if (!allowedMimeType.includes(file_proposal?.mimetype!)) {
            return res.status(400).json({
                success: false,
                message: "Proposal hanya boleh pdf yaa, nggak boleh yang lain."
            })
        }

        const { title, comments } = req.body

        // upload file ke google drive
        const fileBuffer = file_proposal?.buffer;
        const fileName = file_proposal?.originalname;
        const mimeType = file_proposal?.mimetype;
        // const folderId = process.env.GOOGLE_DRIVE_FOLDER_PROPOSAL_ID || '';

        const uploadResult = await uploadFileToDrive(fileBuffer!, fileName!, mimeType!, team?.Category.driveFolderId!)

        const fileLink = uploadResult.webViewLink;
        const proposal = await
            createProposalService(
                Number(team?.id),
                uploadResult.id!,
                String(fileLink),
                fileName!,
                file_proposal?.size!,
                file_proposal?.mimetype!,
                file_proposal?.originalname!,
                uploadResult.webViewLink!,
                title,
                comments
            );

        emitToAdmin("proposal:submitted", {
            message: `Tim "${team?.name}" baru saja menyelesaikan pengiriman proposal mereka yang berjudul "${title}".`
        })
        return res.status(201).json({ success: true, message: "successfully save proposal", data: proposal },)
    } catch (error) {
        return handlerAnyError(error, res)
    }
}


export async function replaceFileProposalController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { id } = req.params
        const user = (req as any).user

        const team = await findTeamUser(user.id)

        const file = req.file
        const allowedMimeType = ["application/pdf"]; // type file yang diizinkan adalah pdf

        if (!allowedMimeType.includes(file?.mimetype!)) {
            return res.status(400).json({
                success: false,
                message: "Proposal hanya boleh pdf yaa, nggak boleh yang lain."
            })
        }

        const fileBuffer = file?.buffer;
        const fileName = file?.originalname;
        const mimeType = file?.mimetype;

        const uploadResult = await uploadFileToDrive(fileBuffer!, fileName!, mimeType!, team?.Category.driveFolderId!)

        const fileLink = uploadResult.webViewLink;
        const replace = await replaceFileProposalService(Number(id), uploadResult.id!, fileLink!, fileName!, file?.size!, file?.originalname!)

        emitToAdmin("proposal:submitted", {
            message: `Tim "${replace?.Team.name}" baru saja mengganti file proposal mereka.`
        })

        return res.status(200).json({
            success: true,
            message: "Berhasil mengganti file proposal"
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}

export async function getProposalTeamController(req: Request, res: Response<ResponseApiType>) {
    try {
        const user = await (req as any).user
        const team = await findTeamUser(user.id)

        const proposal = await getProposalTeamService(team?.id!)

        return res.status(200).json({
            success: true,
            message: "berhasil mendapatkan proposal team",
            data: {
                id: proposal.proposalID,
                title: proposal?.title,
                creadAt: proposal?.createdAt,
                updatedAt: proposal.proposolUpdatedAt,
                status: proposal?.status,
                fileName: proposal?.File?.fileName,
                deadline: proposal.Category?.deadline,
                comments: proposal.comments,
                fileLink: proposal.File?.path
            }
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}

export const getAllproposal = async (req: Request, res: Response<ResponseApiType>) => {
    try {
        const proposals = await getProposalService();
        const proposalsMap = proposals.map((p) => {

            return {
                id: p.id,
                title: p.title,
                status: p.status,
                fileLink: p.File?.path,
                comments: p.comments,
                createdAt: p.createdAt,
                teamName: p.Team.name,
                fileName: p.File?.fileName,
                teamCategory: p.Team.Category.categoriName,
            }
        })
        return res.status(200).json({
            success: true,
            message: "Berhasil mendapatkan data.",
            data: proposalsMap
        });
    } catch (error) {
        return handlerAnyError(error, res)
    }
}

export const deleteProposal = async (req: Request, res: Response<ResponseApiType>) => {
    try {
        const { id } = req.params;
        const deletedProposal = await deleteProposalService(Number(id));
        return res.status(200).json({
            success: true,
            message: "Berhasil menghapus proposal.",
            data: deletedProposal
        });
    } catch (error) {
        return handlerAnyError(error, res)
    }
}

export const reviewProposal = async (req: Request, res: Response<ResponseApiType>) => {
    try {
        const { id } = req.params;
        const { status, comments } = req.body
        const updatedProposal = await updateProposalService(Number(id), status, comments);

        emitToUser(updatedProposal.Team.TeamMember[0].User?.id!, "proposal:reviewed",
            {
                message: status === "approve" ? "Proposal tim anda telah disetujui." :
                    "Proposal tim anda ditolak, silahkan kirim ulang file proposal!."
            })
        return res.status(200).json({
            success: true,
            message: "Berhasil approve proposal.",
            data: updatedProposal
        });
    } catch (error) {
        return handlerAnyError(error, res)
    }
}

export const downloadAllProposal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const approvedProposal = await getAllproposalAproveServices();
        res.attachment("proposal.zip");

        if (approvedProposal.length === 0) {
            return res.status(404).json({ message: "Tidak ada proposal yang ditemukan!." })
        }

        res.setHeader('Content-Type', "application/zip")
        res.setHeader('Content-Disposition', `attachment; filename="proposals.zip"`)

        const archive = archiver("zip", { zlib: { level: 9 } });
        archive.on("error", err => next(err))
        archive.pipe(res);

        for (const p of approvedProposal) {
            const driveRes = await drive.files.get(
                { fileId: p.File?.id, alt: "media" },
                { responseType: "stream" }
            );
            archive.append(driveRes.data as import("stream").Readable, { name: `${p.Team.name}_${p.title}.pdf` })
        }
        await archive.finalize()
    } catch (error: any) {
        next(error)
    }
}