import { Request, Response } from 'express';
import { ResponseApiType } from "../types/api_types";
import { AppError, handlerAnyError } from "../errors/api_errors";
import { deleteTeamService, getAllTeamService, getInfoSubmissionService, unVerifyTeamService, verifyTeamService } from '../services/team.service';
import { sendEmail } from '../utils/mailer';
import { replacePlaceholders } from '../utils/replace_placeholder';
import { readHtmlFile } from '../utils/read_html_file';
import path from 'path';
import { emitToUser } from '../socket';

export async function getAllTeamController(req: Request, res: Response<ResponseApiType>) {
    try {
        const teams = await getAllTeamService()

        const teamsMap = teams.map(team => ({
            id: team.id,
            name: team.name,
            createdAt: team.createdAt,
            category: team.Category.categoriName,
            institution: team.institution,
            members: team.TeamMember.map((mem) => ({ ...mem, noWA: mem.noWa, fileKTM: mem.fileKtm?.path })),
            lecture: team.Lecture.name,
            status: team.verified ? "verified" : "pending",
            proposalLink: team.Proposal.pop()?.fileId || null
        }))

        return res.status(200).json({
            success: true,
            message: "berhasil mendapatkan data",
            data: teamsMap
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}

export async function getInfoSubmissionController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { id } = req.params

        const submission = await getInfoSubmissionService(id)
        const submissionMap = {
            id: submission?.id,
            proposalApproved: submission.proposalApproved,
            teamId: submission?.teamId,
            round: submission?.round,
            status: submission?.status,
            createdAt: submission?.createdAt,
            title: submission?.title,
            category: submission.category,
            fileLink: submission.fileUrl,
            fileName: submission.fileName
        }

        return res.status(200).json({
            success: true,
            message: "Berhasil mendapatkan data",
            data: submissionMap
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}

export async function deleteTeamController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { id } = req.params
        const deleted = await deleteTeamService(Number(id))

        return res.status(200).json({
            success: true,
            message: `Berhasil menghapus team "${deleted.name}"`
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}

export const verifyTeam = async (req: Request, res: Response<ResponseApiType>) => {
    try {
        const { teamID } = req.params;
        const verifyTeam = await verifyTeamService(Number(teamID));

        const leaderTeam = verifyTeam.TeamMember.filter((member) => { return member.role === "leader" })

        // mengirim email verifikasi ke user
        const filePath = path.join(__dirname, '../templates/TeamVerifyNotif.html')
        let emailContent = await readHtmlFile(filePath);
        const link_to_dashboard = `${process.env.FRONTEND_URL}/proposal`;
        emailContent = replacePlaceholders(emailContent, {
            "{{ nama_ketua }}": leaderTeam[0].name,
            "{{ nama_team }}": verifyTeam.name,
            "{{ link_to_dashboard }}": link_to_dashboard
        })
        const sendEmailSuccess = await sendEmail(leaderTeam[0].email, "Team Verified", emailContent);
        // jika email verifikasi gagal terkirim maka lempar error dan hapus user
        if (!sendEmailSuccess) {
            unVerifyTeamService(Number(teamID));
            throw new AppError("Failed send email", 400);
        }
        emitToUser(leaderTeam[0].userId!, "team:verified", { message: `Selamat tim "${verifyTeam.name}", sudah diverifikasi. Sekarang tim kamu sudah bisa upload proposal` })

        return res.status(200).json({ success: true, message: "Successfully verify team.", data: { verifyTeam, leaderTeam } })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}