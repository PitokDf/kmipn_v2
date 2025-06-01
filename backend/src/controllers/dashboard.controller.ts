import { Request, Response } from "express";
import { ResponseApiType } from "../types/api_types";
import { handlerAnyError } from "../errors/api_errors";
import getDashboarAdminService, { getDashboardParticipantDataService } from "../services/dashboard.service";

export async function getDashboardData(req: Request, res: Response<ResponseApiType>) {
    try {
        const user = (req as any).user

        const infor = await getDashboardParticipantDataService(user.id)
        return res.status(200).json({
            success: true,
            message: "Berhasil mendapatkan data.",
            data: {
                id: infor?.Team.id,
                name: infor?.Team.name,
                lecture: {
                    name: infor?.Team.Lecture.name,
                    nip: infor?.Team.Lecture.nip
                },
                verified: infor?.Team.verified,
                category: infor?.Team.Category.categoriName,
                institution: infor?.Team.institution,
                proposal: infor?.Team.Proposal.pop()?.status,
                submission: infor?.Team.Submission[0],
                teamMember: infor?.Team.TeamMember
            }
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}

export async function getDashboarAdminController(req: Request, res: Response<ResponseApiType>) {
    try {
        const data = await getDashboarAdminService()
        const dashboarData = {
            totalTeam: data.countTeam,
            submittedProposal: data.proposals.length,
            rejectedProposal: data.proposals.filter(p => p.status === "rejected").length,
            pendingProposal: data.proposals.filter(p => p.status === "pending").length,
            approveProposal: data.proposals.filter(p => p.status === "approve").length,
            teamCategoryData: data.categories.map(c => ({
                name: c.categoriName,
                count: c.Team.length
            })),
            recentTeams: data.recentTeam.map(t => ({
                teamName: t.name,
                createdAt: t.createdAt,
                category: t.Category.categoriName
            })),
            recentProposal: data.proposals.slice(0, 5).map(p => ({
                proposalTitle: p.title,
                proposalTeam: p.Team.name,
                createdAt: p.createdAt
            }))
        }

        return res.status(200).json({
            success: true,
            message: "Berhasil mendapatkan data",
            data: dashboarData
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}